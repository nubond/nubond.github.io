import html from './live-example.html';
import css from './live-example.scss';

import { Component, ChangeDetector, Detector, IComponentContext } from 'nubond';

import { CodeEditor } from '../code-editor/code-editor';
import { Tooltip } from '../../aspects/tooltip';

import { ContentStore } from '../../services/content-store';
import { Compiler } from '../../services/compiler';
import { ThemeService } from '../../services/theme';

import { ISourceFile } from '../../models/content';
import { ConsoleLevel, ParentMessage, SandboxMessage } from '../../models/sandbox-messages';

const SANDBOX_URL = 'sandbox.html';
const RUN_DELAY = 600;
const MIN_HEIGHT = 56;
const MAX_HEIGHT = 560;
const MAX_CONSOLE_LINES = 100;

interface IConsoleLine {
    level: ConsoleLevel;
    text: string;
}

// An editable example: file tabs + editor on one side, the running result on the other.
//   <live-example nb-in:name="@events/counter"></live-example>
//   <live-example nb-in:name="@containers/counter" nb-in:open="@counter.ts"></live-example>
// Opens index.html first unless 'open' names another file.
// Every run gets a fresh sandbox iframe with its own nuBond instance.
@Component(html, css, ['code-theme'], CodeEditor, Tooltip)
export class LiveExample implements IComponentContext {
    private _name: string | undefined;
    private _iframe: HTMLIFrameElement | undefined;
    private _previewHost: HTMLElement | undefined;
    private _pendingRun: { files: Array<ISourceFile>, compiled: { [name: string]: string } } | undefined;
    private _runTimer: ReturnType<typeof setTimeout> | undefined;
    private _runNumber = 0;
    private readonly _unsubscribers: Array<() => void> = [];
    private readonly _onMessage = (event: MessageEvent<SandboxMessage>) => this.onMessage(event);

    public open: string | undefined;
    public files: Array<ISourceFile> = [];
    public active = 0;
    public modified = false;
    public status = '';
    public lines: Array<IConsoleLine> = [];

    // written from postMessage and timer callbacks: assignment schedules change detection
    @Detector()
    public height = 120;

    @Detector()
    public copied = false;

    public get name(): string | undefined {
        return this._name;
    }

    public set name(value: string | undefined) {
        this._name = value;
        if (value && !this._contentStore.getExample(value)) {
            console.error(`live-example: example '${value}' not found`);
        }
    }

    public get activeFile(): ISourceFile | undefined {
        return this.files[this.active];
    }

    constructor(private _changeDetector: ChangeDetector,
                private _contentStore: ContentStore,
                private _compiler: Compiler,
                private _themeService: ThemeService) {
        window.addEventListener('message', this._onMessage);

        this._unsubscribers.push(
            _themeService.onChange.subscribe(theme => this.post({ type: 'theme', theme })),
            _contentStore.onChange.subscribe(id => {
                // another instance of the same example (or Reset) changed the files
                if ((id === this._name) && !this._runTimer) {
                    this.load();
                    this._changeDetector.detect();
                }
            })
        );
    }

    //
    // lifecycle
    //
    public onInputsRefreshDone(): void {
        this.load();
        this.active = Math.max(0, this.files.findIndex(file => file.name === (this.open ?? 'index.html')));
        this.run();
    }

    public onDispose(): void {
        window.removeEventListener('message', this._onMessage);
        clearTimeout(this._runTimer);
        this._unsubscribers.forEach(unsubscribe => unsubscribe());
    }

    //
    // template API
    //
    public attachPreview(element: HTMLElement): void {
        this._previewHost = element;
        if (this._pendingRun) {
            this.start();
        }
    }

    public select(index: number): void {
        this.active = index;
    }

    public edit(data: { name: string, code: string }): void {
        this._contentStore.update(this._name!, data.name, data.code);
        this.load();

        clearTimeout(this._runTimer);
        this._runTimer = setTimeout(() => {
            this._runTimer = undefined;
            this.run();
        }, RUN_DELAY);
    }

    public reset(): void {
        clearTimeout(this._runTimer);
        this._runTimer = undefined;
        this._contentStore.reset(this._name!);
        this.load();
        this.run();
    }

    public async copy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.activeFile?.code ?? '');
            this.copied = true;
            setTimeout(() => this.copied = false, 1500);
        } catch {
            // no clipboard access (insecure context, denied permission): nothing to confirm
        }
    }

    public async run(): Promise<void> {
        const example = this._name ? this._contentStore.getExample(this._name) : undefined;
        if (!example) {
            return;
        }

        const runNumber = ++this._runNumber;
        const files = this.files;
        let compiled = example.compiled;
        let diagnostics: Array<string> = [];

        if (this.modified) {
            this.status = this._compiler.isLoaded ? 'Compiling…' : 'Loading TypeScript…';
            this._changeDetector.detect();

            try {
                const result = await this._compiler.compile(files, example.compiled, example.files);
                compiled = result.compiled;
                diagnostics = result.diagnostics;
            } catch (ex) {
                if (runNumber === this._runNumber) {
                    this.status = '';
                    this.lines = [{ level: 'error', text: (<Error>ex).message }];
                    this._changeDetector.detect();
                }
                return;
            }

            if (runNumber !== this._runNumber) {
                return;
            }
        }

        this.status = '';
        this.lines = diagnostics.map(text => ({ level: 'error', text }));
        // code with syntax errors would run half-broken: keep the last result until it compiles
        if (diagnostics.length === 0) {
            this._pendingRun = { files, compiled };
            this.start();
        }
        this._changeDetector.detect();
    }

    //
    // sandbox
    //
    private load(): void {
        this.files = this._contentStore.getFiles(this._name!);
        this.modified = this._contentStore.isModified(this._name!);
        this.active = Math.min(this.active, Math.max(0, this.files.length - 1));
    }

    private start(): void {
        if (this._previewHost) {
            const iframe = document.createElement('iframe');
            iframe.title = `Result of ${this._name}`;
            iframe.src = SANDBOX_URL;

            this._iframe = iframe;
            this._previewHost.replaceChildren(iframe);
        }
    }

    private post(message: ParentMessage): void {
        this._iframe?.contentWindow?.postMessage(message, '*');
    }

    private onMessage(event: MessageEvent<SandboxMessage>): void {
        if (!this._iframe || (event.source !== this._iframe.contentWindow)) {
            return;
        }

        const message = event.data;
        switch (message?.type) {
            case 'ready':
                if (this._pendingRun) {
                    this.post({
                        type: 'run',
                        files: this._pendingRun.files.map(file => ({ name: file.name, code: file.code })),
                        compiled: this._pendingRun.compiled,
                        theme: this._themeService.theme
                    });
                }
                break;
            case 'console':
                this.lines = [...this.lines, { level: message.level, text: message.text }].slice(-MAX_CONSOLE_LINES);
                this._changeDetector.detect();
                break;
            case 'height':
                this.height = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT, Math.ceil(message.height)));
                break;
        }
    }
}

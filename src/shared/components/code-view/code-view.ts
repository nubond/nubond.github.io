import html from './code-view.html';
import css from './code-view.scss';

import { Component, Detector } from 'nubond';

import { ContentStore } from '../../services/content-store';
import { Highlight } from '../../transformers/highlight';
import { Tooltip } from '../../aspects/tooltip';
import { ISnippetData, Language } from '../../models/content';

// A read-only code block.
//   <code-view nb-in:name="@routing/grammar.txt"></code-view>    a snippet from content/
//   <code-view nb-in:code="@npm i nubond" nb-in:lang="@sh"></code-view>
@Component(html, css, ['code-theme'], Highlight, Tooltip)
export class CodeView {
    private _name: string | undefined;

    public code: string | undefined;
    public lang: Language | undefined;
    public caption: string | undefined;

    // assigned from a timer, so the decorator schedules the change detection
    @Detector()
    public copied = false;

    public get name(): string | undefined {
        return this._name;
    }

    public set name(value: string | undefined) {
        this._name = value;
        if (value && !this._contentStore.getSnippet(value)) {
            console.error(`code-view: snippet '${value}' not found`);
        }
    }

    public get source(): ISnippetData | undefined {
        return this._name
            ? this._contentStore.getSnippet(this._name)
            : { code: this.code ?? '', lang: this.lang ?? 'txt' };
    }

    constructor(private _contentStore: ContentStore) { }

    public async copy(): Promise<void> {
        try {
            await navigator.clipboard.writeText(this.source?.code ?? '');
            this.copied = true;
            setTimeout(() => this.copied = false, 1500);
        } catch {
            // no clipboard access (insecure context, denied permission): nothing to confirm
        }
    }
}

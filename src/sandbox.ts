// The page every live example runs in. Each run gets a fresh iframe, and with it a fresh
// nuBond instance — so examples never share the registry, the router or the global config.
import * as nubond from 'nubond';

import { interpolate } from './shared/interpolation';
import { ConsoleLevel, ParentMessage, SandboxMessage } from './shared/models/sandbox-messages';

const post = (message: SandboxMessage) => parent.postMessage(message, '*');

//
// console forwarding
//
function describe(value: unknown): string {
    if (typeof value === 'string') {
        return value;
    } else if (value instanceof Error) {
        return value.message;
    } else if (typeof value === 'function') {
        return value.name ? `${/^class\b/.test(Function.prototype.toString.call(value)) ? 'class' : 'function'} ${value.name}` : 'function';
    } else if (value instanceof Node) {
        return value instanceof Element ? `<${value.tagName.toLowerCase()}>` : value.nodeName;
    } else if ((typeof value === 'object') && (value !== null)) {
        try {
            return JSON.stringify(value);
        } catch {
            return String(value);
        }
    }

    return String(value);
}

for (const level of <Array<ConsoleLevel>>['log', 'info', 'warn', 'error']) {
    const original = console[level].bind(console);
    console[level] = (...args: Array<unknown>) => {
        original(...args);
        post({ type: 'console', level, text: args.map(describe).join(' ') });
    };
}

window.addEventListener('error', event => console.error(event.error ?? event.message));
window.addEventListener('unhandledrejection', event => console.error(event.reason));

//
// size reporting
//
// the body, not the document: a document is never shorter than its iframe, so it could not shrink
new ResizeObserver(() => post({ type: 'height', height: Math.max(document.body.getBoundingClientRect().height, document.body.scrollHeight) }))
    .observe(document.body);

//
// a tiny CommonJS loader over the example's files
//
function run(files: Array<{ name: string, code: string }>, compiled: { [name: string]: string }): void {
    const sources = new Map(files.map(file => [file.name, file.code]));
    const modules = new Map<string, { exports: any }>();
    const reportInterpolation = (message: string) => console.warn(message);

    const resolve = (specifier: string): string | undefined => {
        const name = specifier.replace(/^\.\//, '');
        return [name, `${name}.ts`].find(candidate => sources.has(candidate));
    };

    const load = (name: string): any => {
        let module = modules.get(name);
        if (!module) {
            module = { exports: {} };
            modules.set(name, module);

            if (name.endsWith('.ts')) {
                const factory = new Function('exports', 'require', 'module', `${compiled[name]}\n//# sourceURL=${name}`);
                factory(module.exports, require, module);
            } else {
                const code = sources.get(name)!;
                module.exports = { __esModule: true, default: name.endsWith('.html') ? interpolate(code, reportInterpolation) : code };
            }
        }

        return module.exports;
    };

    const require = (specifier: string): any => {
        if (specifier === 'nubond') {
            return nubond;
        }

        const name = resolve(specifier);
        if (name === undefined) {
            throw new Error(`Cannot find module '${specifier}' — examples can import 'nubond' and their own files only`);
        }

        return load(name);
    };

    // index.html is the page: its markup is what @AppRoot binds
    document.body.innerHTML = interpolate(sources.get('index.html') ?? '', reportInterpolation);

    try {
        load('index.ts');
    } catch (ex) {
        console.error(ex);
    }
}

window.addEventListener('message', (event: MessageEvent<ParentMessage>) => {
    if (event.source !== parent) {
        return;
    }

    const message = event.data;
    switch (message?.type) {
        case 'theme':
            document.documentElement.dataset.theme = message.theme;
            break;
        case 'run':
            document.documentElement.dataset.theme = message.theme;
            run(message.files, message.compiled);
            break;
    }
});

post({ type: 'ready' });

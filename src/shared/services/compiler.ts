import { Injectable } from 'nubond';

import compilerOptions from '../../../content/compiler-options.json';

import { ISourceFile } from '../models/content';

// Must match the "typescript" devDependency that precompiles the examples.
const TYPESCRIPT_URL = 'https://cdn.jsdelivr.net/npm/typescript@6.0.2/lib/typescript.min.js';

export interface ICompileResult {
    compiled: { [name: string]: string };
    diagnostics: Array<string>;
}

// Transpiles edited examples in the browser. The TypeScript compiler (~700 KB) is fetched
// only when a reader edits a .ts file for the first time.
@Injectable(true)
export class Compiler {
    private _typescript: Promise<any> | undefined;
    // file name -> its last compiled version
    private readonly _cache = new Map<string, { code: string, js: string, diagnostics: Array<string> }>();

    public isLoaded = false;

    constructor() { }

    private load(): Promise<any> {
        if (!this._typescript) {
            this._typescript = new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = TYPESCRIPT_URL;
                script.crossOrigin = 'anonymous';
                script.onload = () => {
                    this.isLoaded = true;
                    resolve((<any>window).ts);
                };
                script.onerror = () => {
                    this._typescript = undefined;
                    script.remove();
                    reject(new Error(`TypeScript compiler could not be loaded from ${TYPESCRIPT_URL}`));
                };
                document.head.append(script);
            });
        }

        return this._typescript;
    }

    public async compile(files: Array<ISourceFile>, precompiled: { [name: string]: string }, originals: Array<ISourceFile>): Promise<ICompileResult> {
        const result: ICompileResult = { compiled: {}, diagnostics: [] };

        for (const file of files.filter(file => file.lang === 'ts')) {
            const original = originals.find(el => el.name === file.name);
            if (original?.code === file.code) {
                result.compiled[file.name] = precompiled[file.name];
                continue;
            }

            let output = this._cache.get(file.name);
            if (output?.code !== file.code) {
                const ts = await this.load();
                const transpiled = ts.transpileModule(file.code, { compilerOptions, fileName: file.name, reportDiagnostics: true });
                output = {
                    code: file.code,
                    js: transpiled.outputText,
                    diagnostics: (transpiled.diagnostics ?? []).map((diagnostic: any) => {
                        const position = diagnostic.file && (diagnostic.start !== undefined)
                            ? diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start)
                            : undefined;
                        const location = position ? `${file.name}:${position.line + 1}:${position.character + 1}` : file.name;
                        return `${location} ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`;
                    })
                };

                this._cache.set(file.name, output);
            }

            result.compiled[file.name] = output!.js;
            result.diagnostics.push(...output!.diagnostics);
        }

        return result;
    }
}

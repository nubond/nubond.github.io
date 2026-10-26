import { Injectable, CallBackEvent } from 'nubond';

import { EXAMPLES, SNIPPETS } from '../../generated/content';
import { IExampleData, ISnippetData, ISourceFile } from '../models/content';

// Holds every example and the reader's edits to them. Edits live for the session, so
// leaving a page and coming back keeps them; "Reset" restores the original files.
@Injectable(true)
export class ContentStore {
    private readonly _edits = new Map<string, Map<string, string>>();

    public readonly onChange = new CallBackEvent<(id: string) => void>();

    constructor() { }

    public getExample(id: string): IExampleData | undefined {
        return EXAMPLES[id];
    }

    public getSnippet(id: string): ISnippetData | undefined {
        return SNIPPETS[id];
    }

    public getFiles(id: string): Array<ISourceFile> {
        const edits = this._edits.get(id);
        return (EXAMPLES[id]?.files ?? []).map(file => ({ ...file, code: edits?.get(file.name) ?? file.code }));
    }

    public isModified(id: string): boolean {
        return (this._edits.get(id)?.size ?? 0) > 0;
    }

    public update(id: string, name: string, code: string): void {
        const original = EXAMPLES[id]?.files.find(file => file.name === name);
        if (original) {
            let edits = this._edits.get(id);
            if (!edits) {
                edits = new Map();
                this._edits.set(id, edits);
            }

            if (code === original.code) {
                edits.delete(name);
            } else {
                edits.set(name, code);
            }

            this.onChange.raise(id);
        }
    }

    public reset(id: string): void {
        this._edits.delete(id);
        this.onChange.raise(id);
    }
}

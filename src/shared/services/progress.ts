import { Injectable } from 'nubond';

const STORAGE_KEY = 'nubond-docs-visited';

// Remembers which pages the reader has opened, so the sidebar can show progress.
@Injectable(true)
export class Progress {
    private readonly _visited: Set<string>;

    constructor() {
        let stored: Array<string> = [];
        try {
            stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
        } catch { }

        this._visited = new Set(Array.isArray(stored) ? stored : []);
    }

    public has(id: string): boolean {
        return this._visited.has(id);
    }

    public count(ids: Array<string>): number {
        return ids.filter(id => this._visited.has(id)).length;
    }

    public visit(id: string): void {
        if (!this._visited.has(id)) {
            this._visited.add(id);
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify([...this._visited]));
            } catch { }
        }
    }
}

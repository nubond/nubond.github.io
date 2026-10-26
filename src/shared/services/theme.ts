import { Injectable, CallBackEvent } from 'nubond';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'nubond-docs-theme';

@Injectable(true)
export class ThemeService {
    private _theme: Theme;

    public readonly onChange = new CallBackEvent<(theme: Theme) => void>();

    public get theme(): Theme {
        return this._theme;
    }

    constructor() {
        let stored: string | null = null;
        try {
            stored = localStorage.getItem(STORAGE_KEY);
        } catch { }

        this._theme = (stored === 'light') || (stored === 'dark')
            ? stored
            : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        this.apply();
    }

    public toggle(): void {
        this._theme = this._theme === 'dark' ? 'light' : 'dark';
        try {
            localStorage.setItem(STORAGE_KEY, this._theme);
        } catch { }

        this.apply();
        this.onChange.raise(this._theme);
    }

    private apply(): void {
        document.documentElement.dataset.theme = this._theme;
    }
}

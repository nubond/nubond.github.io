import css from './tooltip.scss';

import { Aspect, ElementManipulations } from 'nubond';

// nb-aspect:tooltip="@Text" — a CSS tooltip; the text doubles as the accessible label.
@Aspect(css)
export class Tooltip {
    private _data: string | undefined;

    public get data(): string | undefined {
        return this._data;
    }

    public set data(value: string | undefined) {
        this._data = value;
        this._elementManipulations.attributes.set('data-tooltip', value ?? null);
        this._elementManipulations.attributes.set('aria-label', value ?? null);
    }

    constructor(private _elementManipulations: ElementManipulations) { }
}

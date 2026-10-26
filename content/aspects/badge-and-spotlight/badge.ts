import { Aspect, ElementManipulations } from 'nubond';

@Aspect(`
    [data-badge] { position: relative; }
    [data-badge]::after {
        content: attr(data-badge);
        position: absolute; top: -8px; right: -8px;
        padding: 0 6px; border-radius: 9px;
        background: crimson; color: white; font-size: 12px;
    }`)
export class Badge {
    private _data: number | undefined;

    constructor(private _element: ElementManipulations) { }

    // the value of nb-aspect:badge — the getter lets nuBond skip unchanged values
    public get data(): number | undefined {
        return this._data;
    }

    public set data(value: number | undefined) {
        this._data = value;
        this._element.attributes.set('data-badge', value ? String(value) : null);
    }
}

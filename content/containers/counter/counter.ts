import html from './counter.html';
import { Container, EventDispatcher } from 'nubond';

@Container(html)
export class Counter {
    public start = 0;     // set by nb-in:start
    public clicks = 0;

    constructor(private _eventDispatcher: EventDispatcher) { }

    public get value(): number {
        return this.start + this.clicks;
    }

    public increment(): void {
        this.clicks++;
        if (this.value % 5 === 0) {
            this._eventDispatcher.dispatch('reached', this.value);
        }
    }
}

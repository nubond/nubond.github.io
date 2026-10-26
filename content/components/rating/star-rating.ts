import html from './star-rating.html';
import css from './star-rating.css';
import { Component, EventDispatcher } from 'nubond';

@Component(html, css)
export class StarRating {
    public value = 0;     // nb-in:value
    public max = 5;       // nb-in:max

    constructor(private _eventDispatcher: EventDispatcher) { }

    public select(value: number): void {
        // a CustomEvent 'rate' on <star-rating>, data = event.detail
        this._eventDispatcher.dispatch('rate', value);
    }
}

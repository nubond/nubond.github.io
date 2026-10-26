import { Injectable, CallBackEvent } from 'nubond';

// true = singleton: everyone who asks gets the same instance
@Injectable(true)
export class Cart {
    public readonly items: Array<string> = [];
    public readonly onChange = new CallBackEvent<() => void>();

    constructor() { }

    public add(item: string): void {
        this.items.push(item);
        this.onChange.raise();
    }
}

import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public groups = [
        { name: 'Fruits', items: ['apple', 'pear', 'plum'] },
        { name: 'Vegetables', items: ['carrot', 'leek'] }
    ];
    public stars = 4;
    public prices = new Map([['coffee', 3], ['tea', 2]]);
}

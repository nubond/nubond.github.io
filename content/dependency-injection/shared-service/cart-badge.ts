import { Component, ChangeDetector } from 'nubond';
import { Cart } from './cart';

@Component(`<p>🛒 <b nb-value="this.cart.items.length"></b> items:
               <span nb-value="this.cart.items.join(', ')"></span></p>`)
export class CartBadge {
    private _unsubscribe: () => void;

    constructor(public cart: Cart, changeDetector: ChangeDetector) {
        // a click in <product-list> re-renders <product-list> only, so listen and re-render
        this._unsubscribe = cart.onChange.subscribe(() => changeDetector.detect());
    }

    public onDispose(): void {
        this._unsubscribe();
    }
}

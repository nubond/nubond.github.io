import { Component } from 'nubond';
import { Cart } from './cart';

@Component(`
    <button nb-repeat="this.products" nb-event:click="this.cart.add(item)">
        Add <span nb-value="item"></span>
    </button>`)
export class ProductList {
    public products = ['🍎 apple', '🍐 pear', '🍋 lemon'];

    // resolved by type: the Cart singleton
    constructor(public cart: Cart) { }
}

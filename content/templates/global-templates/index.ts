import { AppRoot, $Template } from 'nubond';

@AppRoot([
    $Template('price-tag', '<b class="tag">$<span nb-value="item.price.toFixed(2)"></span></b>'),
    $Template('sale', '<em>on sale!</em>')
])
export class App {
    public products = [
        { name: 'Coffee', price: 3.5, sale: false },
        { name: 'Tea', price: 2, sale: true }
    ];
}

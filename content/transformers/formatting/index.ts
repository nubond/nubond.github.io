import { AppRoot } from 'nubond';
import { Currency, Plural } from './transformers';

@AppRoot(Currency, Plural)
export class App {
    public prices = [4.5, 12];

    public get total(): number {
        return this.prices.reduce((sum, price) => sum + price, 0);
    }
}

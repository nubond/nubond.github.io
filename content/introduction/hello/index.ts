import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public name = 'world';

    public greet(): void {
        this.name = 'nuBond';
    }
}

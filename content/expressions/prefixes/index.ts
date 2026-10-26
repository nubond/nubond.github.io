import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public clicks = 0;
    public log: Array<string> = [];

    public get time(): string {
        return new Date().toLocaleTimeString();
    }
}

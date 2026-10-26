import { AppRoot } from 'nubond';
import { Counter } from './counter';

// pass what this template uses to its decorator: importing it registers it
@AppRoot(Counter)
export class App {
    public start = 10;
    public log: Array<string> = [];
}

import { AppRoot } from 'nubond';
import { StopWatch } from './stop-watch';

@AppRoot(StopWatch)
export class App {
    public elapsed = 0;
}

import { AppRoot, IContext } from 'nubond';
import { Clock } from './clock';

@AppRoot(Clock)
export class App {
    public view = 'Clock';
    public format: 'time' | 'date' = 'time';

    // a container in MY template was attached / detached
    public onContainerAttached(context: IContext): void {
        console.log(`App: ${context.constructor.name} attached`);
    }

    public onContainerDetached(context: IContext): void {
        console.log(`App: ${context.constructor.name} detached`);
    }
}

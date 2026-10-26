import { AppRoot, ChangeDetector, Detector } from 'nubond';

@AppRoot()
export class App {
    // changed by a timer, which never triggers a pass on its own
    public ticks = 0;

    // assigning a different value schedules a pass
    @Detector()
    public stamp = '';

    constructor(private _changeDetector: ChangeDetector) {
        setInterval(() => this.ticks++, 100);
    }

    public detectLater(): void {
        setTimeout(() => this._changeDetector.detect(), 1000);
    }

    public assignLater(): void {
        setTimeout(() => this.stamp = new Date().toLocaleTimeString(), 1000);
    }

    // a handler that returns a Promise: the pass runs when it settles
    public load(): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, 1000))
            .then(() => { this.stamp = 'loaded'; });
    }
}

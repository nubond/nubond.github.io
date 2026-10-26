import html from './stop-watch.html';
import { Component, ChangeDetector, Eventer } from 'nubond';

@Component(html)
export class StopWatch {
    // assigning dispatches the 'seconds' event; the parent's nb-event runs its pass
    @Eventer()
    public seconds = 0;

    private _timer: ReturnType<typeof setInterval> | undefined;

    constructor(private _changeDetector: ChangeDetector) { }

    public toggle(): void {
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = undefined;
        } else {
            this._timer = setInterval(() => {
                this.seconds++;
                this._changeDetector.detect();  // our own template needs a pass too
            }, 1000);
        }
    }

    public onDispose(): void {
        clearInterval(this._timer);
    }
}

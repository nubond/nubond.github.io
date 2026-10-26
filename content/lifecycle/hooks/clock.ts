import { Container, ChangeDetector, IContext } from 'nubond';

@Container('<h3 nb-value="this.text"></h3>')
export class Clock implements IContext {
    public format = 'time';
    public text = '';
    private _timer: ReturnType<typeof setInterval>;

    constructor(changeDetector: ChangeDetector) {
        console.log('Clock: constructor');
        this._timer = setInterval(() => {
            this.update();
            changeDetector.detect();
        }, 1000);
        this.update();
    }

    public onInputsRefreshDone(): void {
        console.log(`Clock: inputs refreshed, format = ${this.format}`);
        this.update();
    }

    public onDispose(): void {
        clearInterval(this._timer);
        console.log('Clock: disposed');
    }

    private update(): void {
        const now = new Date();
        this.text = this.format === 'time' ? now.toLocaleTimeString() : now.toDateString();
    }
}

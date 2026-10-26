import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public price = 20;
    public quantity = 3;
    public passes = 0;

    public draw(canvas: HTMLCanvasElement): void {
        const context = canvas.getContext('2d')!;
        context.fillStyle = '#3fc495';
        [3, 7, 4, 9, 6].forEach((value, index) => context.fillRect(index * 22, 60 - value * 6, 16, value * 6));
    }
}

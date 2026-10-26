import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public todos = [
        { title: 'Learn nuBond', done: true },
        { title: 'Build an app', done: false }
    ];

    public get left(): number {
        return this.todos.filter(todo => !todo.done).length;
    }

    public add(input: HTMLInputElement): void {
        if (input.value) {
            this.todos.push({ title: input.value, done: false });
            input.value = '';
        }
    }
}

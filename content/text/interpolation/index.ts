import { AppRoot } from 'nubond';

@AppRoot()
export class App {
    public user = { first: 'Ada', last: 'Lovelace' };
    public unread = 3;
    public rich = 'Some <b>bold</b> and <i>italic</i> text';
}

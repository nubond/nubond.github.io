import html from './card.html';
import { Container } from 'nubond';

@Container(html)
export class Card {
    public likes = 0;

    constructor() { }

    public like(): void {
        this.likes++;
    }
}

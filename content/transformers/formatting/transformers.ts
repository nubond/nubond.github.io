import { Transformer } from 'nubond';

// the class name, camelCased, is the function name: currency(…)
@Transformer()
export class Currency {
    public transform(value: number, currency = 'USD'): string {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
    }
}

@Transformer()
export class Plural {
    public transform(count: number, word: string): string {
        return `${count} ${word}${count === 1 ? '' : 's'}`;
    }
}

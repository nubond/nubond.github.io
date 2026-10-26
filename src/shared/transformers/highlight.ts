import { Transformer } from 'nubond';

import { highlight } from '../highlight/highlighter';
import { Language } from '../models/content';

// highlight(code, lang) — returns highlighted HTML for nb-html.
@Transformer()
export class Highlight {
    constructor() { }

    public transform(code: string | undefined, lang: Language | undefined): string {
        return highlight(code, lang);
    }
}

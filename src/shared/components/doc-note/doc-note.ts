import html from './doc-note.html';
import css from './doc-note.scss';

import { Component } from 'nubond';

// A callout. Content is projected into it:
//   <doc-note nb-in:kind="@tip"><p nb-projection>…</p></doc-note>
@Component(html, css, ['code-theme', 'prose'])
export class DocNote {
    public kind: 'info' | 'tip' | 'warn' = 'info';

    constructor() { }
}

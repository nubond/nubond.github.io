import { AppRoot } from 'nubond';

@AppRoot({
    // data-nb-* attributes, '--' instead of ':'
    complyWithW3C: true,
    // runs on every nb-html value (use a real sanitizer such as DOMPurify in an app)
    htmlSanitizer: html => html.replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
})
export class App {
    public clicks = 0;
    public html = '<b>bold</b> <img src="data:," onerror="document.body.style.background = \'red\'"> image';
}

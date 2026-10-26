import html from './code-editor.html';
import css from './code-editor.scss';

import { Component, EventDispatcher } from 'nubond';

import { Highlight } from '../../transformers/highlight';
import { Language } from '../../models/content';

const INDENT = '    ';
// a line ending in one of these opens a block, so Enter indents one level deeper
// ({, ( or [ — or an opening tag that is neither void nor self-closing)
const OPENS_BLOCK = /([{([]|<(?!(?:area|base|br|col|embed|hr|img|input|link|meta|source|track|wbr)\b)[a-zA-Z](?:[^<>]*[^/<>])?>)\s*$/;

// A light code editor: a transparent <textarea> over a highlighted <pre>.
//   in:  code, lang, name
//   out: code-change ({ name, code }) on every edit, run on Ctrl/Cmd+Enter
@Component(html, css, ['code-theme'], Highlight)
export class CodeEditor {
    private _textarea: HTMLTextAreaElement | undefined;
    private _code = '';

    public lang: Language = 'ts';
    public name = '';

    public get code(): string {
        return this._code;
    }

    public set code(value: string | undefined) {
        this._code = value ?? '';
        if (this._textarea && (this._textarea.value !== this._code)) {
            this._textarea.value = this._code;
            // the textarea is as tall as its content; the wrapper is what scrolls
            this._textarea.parentElement!.scrollTo(0, 0);
        }
    }

    constructor(private _eventDispatcher: EventDispatcher) { }

    public attach(textarea: HTMLTextAreaElement): void {
        this._textarea = textarea;
        textarea.value = this._code;
    }

    public onInput(): void {
        this._code = this._textarea!.value;
        // dispatched on every input: an @Eventer would skip a value equal to the previous one,
        // and the same text can legitimately come twice (type, Reset, type the same again)
        this._eventDispatcher.dispatch('code-change', { name: this.name, code: this._code });
    }

    public onKeyDown(event: KeyboardEvent): void {
        const textarea = this._textarea!;
        if (event.isComposing) {
            return;
        }

        if ((event.key === 'Enter') && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            this._eventDispatcher.dispatch('run');
        } else if (event.key === 'Escape') {
            // Tab indents, so Escape is the way out of the editor for keyboard users
            textarea.blur();
        } else if ((event.key === 'Tab') && !event.altKey && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            if (event.shiftKey) {
                this.outdent(textarea);
            } else {
                this.insert(textarea, INDENT);
            }
        } else if ((event.key === 'Enter') && !event.shiftKey) {
            event.preventDefault();
            const lineStart = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1;
            const before = textarea.value.substring(lineStart, textarea.selectionStart);
            const indent = /^[ \t]*/.exec(before)![0];
            this.insert(textarea, '\n' + indent + (OPENS_BLOCK.test(before) ? INDENT : ''));
        }
    }

    private insert(textarea: HTMLTextAreaElement, text: string): void {
        // execCommand keeps the browser's undo stack; setRangeText is the fallback
        if (!document.execCommand('insertText', false, text)) {
            textarea.setRangeText(text, textarea.selectionStart, textarea.selectionEnd, 'end');
            this.onInput();
        }
    }

    private outdent(textarea: HTMLTextAreaElement): void {
        const lineStart = textarea.value.lastIndexOf('\n', textarea.selectionStart - 1) + 1;
        const removable = /^ {1,4}/.exec(textarea.value.substring(lineStart))?.[0].length ?? 0;
        if (removable > 0) {
            const caret = textarea.selectionStart;
            textarea.setSelectionRange(lineStart, lineStart + removable);
            if (!document.execCommand('delete')) {
                textarea.setRangeText('', lineStart, lineStart + removable, 'start');
                this.onInput();
            }
            const position = Math.max(lineStart, caret - removable);
            textarea.setSelectionRange(position, position);
        }
    }
}

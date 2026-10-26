import { Language } from '../models/content';

// A small dependency-free highlighter for the languages the docs show. It is tuned for
// nuBond: nb-* attribute names stand out, and their values and {{ }} interpolations are
// highlighted as TypeScript expressions.

const TS_KEYWORDS = new Set([
    'abstract', 'any', 'as', 'async', 'await', 'boolean', 'break', 'case', 'catch', 'class', 'const', 'constructor',
    'continue', 'declare', 'default', 'delete', 'do', 'else', 'enum', 'export', 'extends', 'false', 'finally', 'for',
    'from', 'function', 'get', 'if', 'implements', 'import', 'in', 'instanceof', 'interface', 'let', 'new', 'null',
    'number', 'of', 'private', 'protected', 'public', 'readonly', 'return', 'set', 'static', 'string', 'super',
    'switch', 'this', 'throw', 'true', 'try', 'type', 'typeof', 'undefined', 'unknown', 'var', 'void', 'while', 'yield'
]);

const NB_PREFIX = /^(data-)?nb-/;
const EXPRESSION_PREFIX = /^\s*[#@%]/;

export function escapeHtml(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function token(cssClass: string, value: string): string {
    return `<span class="t-${cssClass}">${escapeHtml(value)}</span>`;
}

//
// TypeScript / JavaScript
//
const TS_TOKENS = new RegExp([
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',               // 1 comment
    '(`(?:\\\\[\\s\\S]|[^\\\\`])*`?)',                       // 2 template literal
    '("(?:\\\\.|[^\\\\"\\n])*"?|\'(?:\\\\.|[^\\\\\'\\n])*\'?)', // 3 string
    '(@[A-Za-z_$][\\w$]*)',                                 // 4 decorator
    '(\\b(?:0x[\\da-fA-F_]+|\\d[\\d_]*(?:\\.\\d+)?(?:e[+-]?\\d+)?n?)\\b)', // 5 number
    '([A-Za-z_$][\\w$]*)'                                   // 6 identifier
].join('|'), 'g');

export function highlightTs(code: string): string {
    let result = '';
    let position = 0;

    TS_TOKENS.lastIndex = 0;
    for (let match = TS_TOKENS.exec(code); match != null; match = TS_TOKENS.exec(code)) {
        result += escapeHtml(code.substring(position, match.index));
        position = match.index + match[0].length;

        if (match[1]) {
            result += token('c', match[1]);
        } else if (match[2] || match[3]) {
            result += token('s', match[0]);
        } else if (match[4]) {
            result += token('d', match[4]);
        } else if (match[5]) {
            result += token('n', match[5]);
        } else {
            const word = match[6];
            const next = code.substring(position).match(/^\s*(\(|<[A-Z])/);
            if (TS_KEYWORDS.has(word)) {
                result += token('k', word);
            } else if (/^[A-Z]/.test(word)) {
                result += token('t', word);
            } else if (next) {
                result += token('f', word);
            } else {
                result += escapeHtml(word);
            }
        }
    }

    return result + escapeHtml(code.substring(position));
}

//
// CSS
//
export function highlightCss(code: string): string {
    let result = '';
    const pattern = /(\/\*[\s\S]*?\*\/)|("(?:\\.|[^"])*"|'(?:\\.|[^'])*')|(@[\w-]+)|([{};:])|([^{};:"'/@]+|\/)/g;
    let inBlock = 0;
    let afterColon = false;

    for (let match = pattern.exec(code); match != null; match = pattern.exec(code)) {
        if (match[1]) {
            result += token('c', match[1]);
        } else if (match[2]) {
            result += token('s', match[2]);
        } else if (match[3]) {
            result += token('at', match[3]);
        } else if (match[4]) {
            const char = match[4];
            if (char == '{') {
                inBlock++;
                afterColon = false;
            } else if (char == '}') {
                inBlock = Math.max(0, inBlock - 1);
                afterColon = false;
            } else if (char == ';') {
                afterColon = false;
            } else if ((char == ':') && (inBlock > 0)) {
                afterColon = true;
            }
            result += escapeHtml(char);
        } else {
            const text = match[5];
            // a declaration lives inside a block; selectors (also of nested rules) are followed by '{'
            const isSelector = (inBlock == 0) || /^[^;]*$/.test(text) && code.substring(pattern.lastIndex).trimStart().startsWith('{');
            if (afterColon && !isSelector) {
                result += text.replace(/[^\s]+/g, part => /^-?[\d.]/.test(part) ? token('n', part) : token('v', part));
            } else if (isSelector) {
                result += text.replace(/[^\s,]+/g, part => token('sel', part));
            } else {
                result += text.replace(/[^\s]+/g, part => token('prop', part));
            }
        }
    }

    return result;
}

//
// HTML (with nuBond awareness)
//
function highlightAttribute(name: string, value: string | undefined, quote: string): string {
    const isNb = NB_PREFIX.test(name);
    let result: string;

    if (isNb) {
        // the meta part starts at ':' (nb-event:click) or '--' in W3C mode (data-nb-event--click)
        const prefixLength = NB_PREFIX.exec(name)![0].length;
        const colonIndex = name.indexOf(':', prefixLength);
        const metaIndex = colonIndex >= 0 ? colonIndex : name.indexOf('--', prefixLength);
        result = metaIndex > 0
            ? token('nb', name.substring(0, metaIndex)) + token('m', name.substring(metaIndex))
            : token('nb', name);
    } else {
        result = token('a', name);
    }

    if (value !== undefined) {
        result += escapeHtml('=') + escapeHtml(quote);
        if (isNb && value.length > 0) {
            const prefix = EXPRESSION_PREFIX.exec(value);
            if (prefix && value.trim().startsWith('@')) {
                result += token('const', value);
            } else if (prefix) {
                result += token('px', prefix[0]) + highlightTs(value.substring(prefix[0].length));
            } else {
                result += highlightTs(value);
            }
        } else {
            result += token('v', value);
        }
        result += escapeHtml(quote);
    }

    return result;
}

function highlightText(text: string): string {
    let result = '';
    let position = 0;
    const pattern = /\{\{([\s\S]*?)\}\}/g;

    for (let match = pattern.exec(text); match != null; match = pattern.exec(text)) {
        result += escapeHtml(text.substring(position, match.index));
        result += token('i', '{{') + highlightTs(match[1]) + token('i', '}}');
        position = match.index + match[0].length;
    }

    return result + escapeHtml(text.substring(position));
}

export function highlightHtml(code: string): string {
    let result = '';
    let index = 0;

    while (index < code.length) {
        const tagStart = code.indexOf('<', index);
        if (tagStart < 0) {
            result += highlightText(code.substring(index));
            break;
        }

        result += highlightText(code.substring(index, tagStart));

        if (code.startsWith('<!--', tagStart)) {
            const end = code.indexOf('-->', tagStart);
            const commentEnd = end < 0 ? code.length : end + 3;
            result += token('c', code.substring(tagStart, commentEnd));
            index = commentEnd;
            continue;
        }

        const tagMatch = /^<(\/?)([a-zA-Z][\w-]*|!doctype)/i.exec(code.substring(tagStart));
        if (!tagMatch) {
            result += escapeHtml('<');
            index = tagStart + 1;
            continue;
        }

        result += escapeHtml('<' + tagMatch[1]) + token('tag', tagMatch[2]);
        index = tagStart + tagMatch[0].length;

        // attributes up to '>'
        const attributePattern = /\s+|([^\s=>"'/]+)(?:(\s*=\s*)("([^"]*)"?|'([^']*)'?|[^\s>]+))?|(\/?>)|([\s\S])/y;
        attributePattern.lastIndex = index;
        let closed = false;
        for (let match = attributePattern.exec(code); match != null && !closed; match = attributePattern.exec(code)) {
            index = attributePattern.lastIndex;
            if (match[6]) {
                result += escapeHtml(match[6]);
                closed = true;
            } else if (match[1]) {
                if (match[3] !== undefined) {
                    const quote = match[3].startsWith('"') ? '"' : (match[3].startsWith('\'') ? '\'' : '');
                    const value = match[4] ?? match[5] ?? match[3];
                    result += highlightAttribute(match[1], value, quote);
                } else {
                    result += highlightAttribute(match[1], undefined, '');
                }
            } else {
                result += escapeHtml(match[0]);
            }
        }

        // raw text elements
        const tagName = tagMatch[2].toLowerCase();
        if (!tagMatch[1] && ((tagName == 'style') || (tagName == 'script'))) {
            const closeStart = code.toLowerCase().indexOf(`</${tagName}`, index);
            const rawEnd = closeStart < 0 ? code.length : closeStart;
            const raw = code.substring(index, rawEnd);
            result += tagName == 'style' ? highlightCss(raw) : highlightTs(raw);
            index = rawEnd;
        }
    }

    return result;
}

//
// Shell / JSON / text
//
export function highlightShell(code: string): string {
    return code.split('\n').map(line => {
        const commentIndex = line.search(/(^|\s)#/);
        const command = commentIndex >= 0 ? line.substring(0, commentIndex) : line;
        const comment = commentIndex >= 0 ? line.substring(commentIndex) : '';
        const highlighted = command.replace(/^(\s*)(\S+)/, '$1\u0000$2\u0001');
        return escapeHtml(highlighted)
                .replace('\u0000', '<span class="t-f">').replace('\u0001', '</span>')
            + (comment ? token('c', comment) : '');
    }).join('\n');
}

export function highlightJson(code: string): string {
    return escapeHtml(code)
        .replace(/("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)/g,
                 (all, text, colon, keyword, num) => text
                     ? `<span class="t-${colon ? 'prop' : 's'}">${text}</span>${colon ?? ''}`
                     : (keyword ? `<span class="t-k">${keyword}</span>` : `<span class="t-n">${num}</span>`));
}

export function highlight(code: string | undefined, lang: Language | undefined): string {
    const source = code ?? '';
    switch (lang) {
        case 'ts': return highlightTs(source);
        case 'html': return highlightHtml(source);
        case 'css': return highlightCss(source);
        case 'sh': return highlightShell(source);
        case 'json': return highlightJson(source);
        default: return escapeHtml(source);
    }
}

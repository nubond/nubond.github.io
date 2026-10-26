// Runtime port of @nubond/posthtml-value-interpolation: inside text content, {{ expression }}
// becomes <span nb-value="expression"></span>. Tags, attributes, comments and the bodies of
// <script>/<style> are left untouched — exactly what the build-time plugin does in a real project.

const RAW_TEXT_TAGS = ['script', 'style'];

function interpolateText(text: string, onError: (message: string) => void): string {
    const pairs: Array<{ start: number, end: number }> = [];

    let previousChar = '';
    let currentChar = '';
    let startIndex = -1;
    let unclosedBrackets = 0;

    for (let index = 0; index < text.length; index++) {
        previousChar = currentChar;
        currentChar = text[index];

        if (currentChar == '{') {
            unclosedBrackets++;
            if (previousChar == '{') {
                startIndex = index - 1;
            }
        } else if (currentChar == '}') {
            unclosedBrackets--;
            if ((previousChar == '}') && (unclosedBrackets == 0) && (startIndex >= 0)) {
                pairs.push({ start: startIndex, end: index });
                startIndex = -1;
            }
        }
    }

    if (unclosedBrackets != 0) {
        onError(`[posthtml-value-interpolation] ${text.trim()} contains invalid interpolation`);
        return text;
    }

    let result = '';
    let position = 0;
    for (const pair of pairs) {
        result += text.substring(position, pair.start);
        result += `<span nb-value="${text.substring(pair.start + 2, pair.end - 1).replaceAll('"', '\'')}"></span>`;
        position = pair.end + 1;
    }

    return result + text.substring(position);
}

export function interpolate(html: string, onError: (message: string) => void = message => console.error(message)): string {
    let result = '';
    let index = 0;

    while (index < html.length) {
        // a '<' that cannot open a tag or comment is plain text
        let tagStart = index - 1;
        do {
            tagStart = html.indexOf('<', tagStart + 1);
        } while ((tagStart >= 0) && !/[a-zA-Z/!]/.test(html[tagStart + 1] ?? ''));

        const textEnd = tagStart < 0 ? html.length : tagStart;

        if (textEnd > index) {
            result += interpolateText(html.substring(index, textEnd), onError);
        }
        if (tagStart < 0) {
            break;
        }

        if (html.startsWith('<!--', tagStart)) {
            const commentEnd = html.indexOf('-->', tagStart + 4);
            index = commentEnd < 0 ? html.length : commentEnd + 3;
            result += html.substring(tagStart, index);
            continue;
        }

        // scan to the end of the tag, skipping quoted attribute values
        let tagEnd = tagStart + 1;
        let quote = '';
        while (tagEnd < html.length) {
            const char = html[tagEnd];
            if (quote) {
                if (char == quote) {
                    quote = '';
                }
            } else if ((char == '"') || (char == '\'')) {
                quote = char;
            } else if (char == '>') {
                break;
            }
            tagEnd++;
        }

        const tag = html.substring(tagStart, tagEnd + 1);
        result += tag;
        index = tagEnd + 1;

        const tagName = /^<([a-zA-Z][\w-]*)/.exec(tag)?.[1]?.toLowerCase();
        if (tagName && RAW_TEXT_TAGS.includes(tagName)) {
            const closeStart = html.toLowerCase().indexOf(`</${tagName}`, index);
            const rawEnd = closeStart < 0 ? html.length : closeStart;
            result += html.substring(index, rawEnd);
            index = rawEnd;
        }
    }

    return result;
}

export type Language = 'ts' | 'html' | 'css' | 'json' | 'sh' | 'txt';

export interface ISourceFile {
    name: string;
    lang: Language;
    code: string;
}

export interface IExampleData {
    files: Array<ISourceFile>;
    // file name -> CommonJS output, precompiled at build time
    compiled: { [name: string]: string };
}

export interface ISnippetData {
    lang: Language;
    code: string;
}

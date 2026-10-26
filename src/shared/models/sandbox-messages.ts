// Messages exchanged between a <live-example> and its sandbox iframe.

export interface IRunMessage {
    type: 'run';
    files: Array<{ name: string, code: string }>;
    compiled: { [name: string]: string };
    theme: string;
}

export interface IThemeMessage {
    type: 'theme';
    theme: string;
}

export type ConsoleLevel = 'log' | 'info' | 'warn' | 'error';

export interface IConsoleMessage {
    type: 'console';
    level: ConsoleLevel;
    text: string;
}

export interface IReadyMessage {
    type: 'ready';
}

export interface IHeightMessage {
    type: 'height';
    height: number;
}

export type ParentMessage = IRunMessage | IThemeMessage;
export type SandboxMessage = IReadyMessage | IConsoleMessage | IHeightMessage;

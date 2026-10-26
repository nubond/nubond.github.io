// Examples import their templates and styles as strings, like a Parcel project does.
declare module '*.html' {
    const value: string;
    export default value;
}

declare module '*.css' {
    const value: string;
    export default value;
}

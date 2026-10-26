import { Injectable } from 'nubond';

export interface IPage {
    // also the route slot value and the page container name
    id: string;
    title: string;
    minutes: number;
    // extra words the sidebar filter matches
    keywords: string;
}

export interface IPart {
    title: string;
    subtitle: string;
    pages: Array<IPage>;
    minutes: number;
}

const PARTS: Array<Omit<IPart, 'minutes'>> = [
    {
        title: 'The basics',
        subtitle: '15 minutes',
        pages: [
            { id: 'introduction', title: 'Hello, nuBond', minutes: 2, keywords: 'install create npm app root setup start' },
            { id: 'text', title: 'Text & HTML', minutes: 1, keywords: '{{ }} interpolation nb-value nb-html compliantWithW3CInterpolation' },
            { id: 'expressions', title: 'Expressions', minutes: 1, keywords: 'prefix # @ one-time constant this' },
            { id: 'events', title: 'Events', minutes: 1.5, keywords: 'nb-event click input debounce once unsubscribe' },
            { id: 'classes-and-styles', title: 'Classes & styles', minutes: 1.5, keywords: 'nb-class nb-style css important' },
            { id: 'attributes', title: 'Attributes & properties', minutes: 1, keywords: 'nb-attr nb-prop disabled checked' },
            { id: 'conditionals', title: 'Conditionals', minutes: 1.5, keywords: 'nb-if nb-switch nb-case nb-default hidden' },
            { id: 'lists', title: 'Lists', minutes: 1.5, keywords: 'nb-repeat loop item index count prefix' },
            { id: 'containers', title: 'Containers', minutes: 2, keywords: '@Container nb-container nb-in input output page' },
            { id: 'components', title: 'Components', minutes: 2, keywords: '@Component shadow dom custom element nb-in-ref EventDispatcher' }
        ]
    },
    {
        title: 'Everything else',
        subtitle: '15 more minutes',
        pages: [
            { id: 'change-detection', title: 'Change detection', minutes: 2, keywords: 'ChangeDetector detect @Detector @Eventer pessimistic optimistic' },
            { id: 'dependency-injection', title: 'Dependency injection', minutes: 1.5, keywords: '@Injectable singleton $Injectable services di' },
            { id: 'routing', title: 'Routing', minutes: 2, keywords: 'Router go slot hash path state %' },
            { id: 'variables', title: 'Variables & DOM access', minutes: 1, keywords: 'nb-var nb-exec nb-bound nativeElement' },
            { id: 'aspects', title: 'Aspects', minutes: 1, keywords: '@Aspect nb-aspect mixin behavior tooltip' },
            { id: 'transformers', title: 'Transformers', minutes: 1, keywords: '@Transformer pipe format function' },
            { id: 'templates', title: 'Templates & projection', minutes: 1.5, keywords: '$Template nb-template nb-projection nb-project-to nb-project-instead slot' },
            { id: 'styles', title: 'Styles & adopted styles', minutes: 1, keywords: '$AdoptedStyle css host shadow theme' },
            { id: 'lifecycle', title: 'Lifecycle hooks', minutes: 1, keywords: 'onDispose onInputsRefreshDone onDetectChangesDone onContainerAttached' },
            { id: 'configuration', title: 'Configuration & security', minutes: 2, keywords: '$Config showDebugInfo w3c data-nb sanitizer xss shadowRootConfig $GlobalShadowRootConfig compliantWithW3CInterpolation' },
            { id: 'toolbox', title: 'Helpers & tooling', minutes: 1, keywords: 'Helpers CallBackEvent cli parcel vscode extension' }
        ]
    },
    {
        title: 'Reference',
        subtitle: 'keep it open',
        pages: [
            { id: 'cheat-sheet', title: 'Cheat sheet', minutes: 0, keywords: 'all attributes decorators reference table' },
            { id: 'gotchas', title: 'Gotchas', minutes: 0, keywords: 'pitfalls errors mistakes rules' }
        ]
    }
];

@Injectable(true)
export class Catalog {
    public readonly parts: Array<IPart> = PARTS.map(part => ({
        ...part,
        minutes: part.pages.reduce((sum, page) => sum + page.minutes, 0)
    }));

    public readonly pages: Array<IPage> = this.parts.flatMap(part => part.pages);

    constructor() { }

    public get(id: string | undefined): IPage | undefined {
        return this.pages.find(page => page.id === id?.toLowerCase());
    }

    public previous(id: string | undefined): IPage | undefined {
        const index = this.pages.findIndex(page => page.id === id?.toLowerCase());
        return index > 0 ? this.pages[index - 1] : undefined;
    }

    public next(id: string | undefined): IPage | undefined {
        const index = this.pages.findIndex(page => page.id === id?.toLowerCase());
        return (index >= 0) && (index < this.pages.length - 1) ? this.pages[index + 1] : undefined;
    }

    public matches(page: IPage, filter: string | undefined): boolean {
        const words = (filter ?? '').toLowerCase().split(/\s+/).filter(word => word.length > 0);
        const text = `${page.title} ${page.keywords}`.toLowerCase();
        return words.every(word => text.includes(word));
    }
}

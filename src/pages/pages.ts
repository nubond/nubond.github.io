// One container per lesson. The container name is the lesson id, which is also the
// value of the route slot: '#/events' renders the 'events' container into nb-container="%page".
import { Container, IContextConstructor } from 'nubond';

import introduction from './introduction.html';
import text from './text.html';
import expressions from './expressions.html';
import events from './events.html';
import classesAndStyles from './classes-and-styles.html';
import attributes from './attributes.html';
import conditionals from './conditionals.html';
import lists from './lists.html';
import containers from './containers.html';
import components from './components.html';
import changeDetection from './change-detection.html';
import dependencyInjection from './dependency-injection.html';
import routing from './routing.html';
import variables from './variables.html';
import aspects from './aspects.html';
import transformers from './transformers.html';
import templates from './templates.html';
import styles from './styles.html';
import lifecycle from './lifecycle.html';
import configuration from './configuration.html';
import toolbox from './toolbox.html';
import cheatSheet from './cheat-sheet.html';
import gotchas from './gotchas.html';

@Container(['introduction', introduction])
export class IntroductionPage {
    constructor() { }
}

@Container(['text', text])
export class TextPage {
    constructor() { }
}

@Container(['expressions', expressions])
export class ExpressionsPage {
    constructor() { }
}

@Container(['events', events])
export class EventsPage {
    constructor() { }
}

@Container(['classes-and-styles', classesAndStyles])
export class ClassesAndStylesPage {
    constructor() { }
}

@Container(['attributes', attributes])
export class AttributesPage {
    constructor() { }
}

@Container(['conditionals', conditionals])
export class ConditionalsPage {
    constructor() { }
}

@Container(['lists', lists])
export class ListsPage {
    constructor() { }
}

@Container(['containers', containers])
export class ContainersPage {
    constructor() { }
}

@Container(['components', components])
export class ComponentsPage {
    constructor() { }
}

@Container(['change-detection', changeDetection])
export class ChangeDetectionPage {
    constructor() { }
}

@Container(['dependency-injection', dependencyInjection])
export class DependencyInjectionPage {
    constructor() { }
}

@Container(['routing', routing])
export class RoutingPage {
    constructor() { }
}

@Container(['variables', variables])
export class VariablesPage {
    constructor() { }
}

@Container(['aspects', aspects])
export class AspectsPage {
    constructor() { }
}

@Container(['transformers', transformers])
export class TransformersPage {
    constructor() { }
}

@Container(['templates', templates])
export class TemplatesPage {
    constructor() { }
}

@Container(['styles', styles])
export class StylesPage {
    constructor() { }
}

@Container(['lifecycle', lifecycle])
export class LifecyclePage {
    constructor() { }
}

@Container(['configuration', configuration])
export class ConfigurationPage {
    constructor() { }
}

@Container(['toolbox', toolbox])
export class ToolboxPage {
    constructor() { }
}

@Container(['cheat-sheet', cheatSheet])
export class CheatSheetPage {
    constructor() { }
}

@Container(['gotchas', gotchas])
export class GotchasPage {
    constructor() { }
}

export const PAGES: Array<IContextConstructor> = [
    IntroductionPage,
    TextPage,
    ExpressionsPage,
    EventsPage,
    ClassesAndStylesPage,
    AttributesPage,
    ConditionalsPage,
    ListsPage,
    ContainersPage,
    ComponentsPage,
    ChangeDetectionPage,
    DependencyInjectionPage,
    RoutingPage,
    VariablesPage,
    AspectsPage,
    TransformersPage,
    TemplatesPage,
    StylesPage,
    LifecyclePage,
    ConfigurationPage,
    ToolboxPage,
    CheatSheetPage,
    GotchasPage
];

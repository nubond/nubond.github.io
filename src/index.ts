import { AppRoot, Router, $AdoptedStyle, $Template } from 'nubond';

import codeTheme from './shared/styles/code-theme.scss';
import prose from './shared/styles/prose.scss';
import inputsOutputs from './pages/shared/inputs-outputs.html';
import registration from './pages/shared/registration.html';

import { defineIcons } from './shared/templates/icons';
import { Tooltip } from './shared/aspects/tooltip';
import { Highlight } from './shared/transformers/highlight';
import { CodeView } from './shared/components/code-view/code-view';
import { DocNote } from './shared/components/doc-note/doc-note';
import { LiveExample } from './shared/components/live-example/live-example';

import { Catalog, IPage } from './shared/services/catalog';
import { Progress } from './shared/services/progress';
import { ThemeService } from './shared/services/theme';

import { PAGES } from './pages/pages';

@AppRoot(
    { showDebugInfo: process.env.NODE_ENV !== 'production' },
    '/#[page=introduction]',
    [
        ...defineIcons(),
        $AdoptedStyle('code-theme', codeTheme), $AdoptedStyle('prose', prose),
        // sections shared by the Containers and Components lessons
        $Template('inputs-outputs', inputsOutputs),
        $Template('registration', registration)
    ],
    ...PAGES,
    LiveExample, CodeView, DocNote, Tooltip, Highlight
)
export class App {
    public menuOpen = false;
    public filter = '';

    public get page(): IPage | undefined {
        return this.catalog.get(this.router.state?.page);
    }

    constructor(public router: Router,
                public catalog: Catalog,
                public progress: Progress,
                public themeService: ThemeService) {
        // the router resolved the initial URL before this constructor ran
        this.onPageShown(router.state?.page);

        router.onAfterStateChange((oldState, newState) => {
            this.menuOpen = false;
            if (oldState.page !== newState.page) {
                this.onPageShown(newState.page);
                window.scrollTo(0, 0);
            }
        });
    }

    private onPageShown(id: string | undefined): void {
        const page = this.catalog.get(id);
        if (page) {
            this.progress.visit(page.id);
            document.title = `${page.title} · nuBond docs`;
        }
    }

    public readCount(): number {
        return this.progress.count(this.catalog.pages.filter(page => page.minutes > 0).map(page => page.id));
    }

    public lessonCount(): number {
        return this.catalog.pages.filter(page => page.minutes > 0).length;
    }
}

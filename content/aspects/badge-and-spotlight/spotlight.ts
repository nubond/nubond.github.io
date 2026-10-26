import { Aspect, ElementSubscriptions } from 'nubond';

@Aspect(`
    .spotlight {
        padding: 28px; border-radius: 10px; border: 1px solid #8884;
        background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), #3fc49566, transparent 120px);
    }`)
export class Spotlight {
    // the host element and its subscriptions are injected
    constructor(host: HTMLElement, subscriptions: ElementSubscriptions) {
        host.classList.add('spotlight');

        // pointermove fires constantly: a plain listener, no change detection
        subscriptions.subscribe('pointermove', (event: PointerEvent) => {
            const rect = host.getBoundingClientRect();
            host.style.setProperty('--x', `${event.clientX - rect.left}px`);
            host.style.setProperty('--y', `${event.clientY - rect.top}px`);
        });
    }
}

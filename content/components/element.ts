class RatingElement extends HTMLElement {
    static observedAttributes = ['size'];

    attributeChangedCallback(name: string, oldValue: string, value: string) { /* … */ }
}

@Component(html, css, RatingElement, { shadowRootConfig: { mode: 'open', delegatesFocus: true } })
export class StarRating {
    constructor(private _host: RatingElement) { }   // <star-rating> itself
}

@AppRoot({
    showDebugInfo: true,                       // extra warnings; expression errors throw (development only)
    complyWithW3C: false,                      // data-nb-* attributes
    pessimisticChangeDetectionStrategy: false, // see Change detection
    htmlSanitizer: html => DOMPurify.sanitize(html),
    styleSanitizer: css => css.replace(/@import[^;]*;/g, '')
})

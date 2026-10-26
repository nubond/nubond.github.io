// for the whole app
@AppRoot({ pessimisticChangeDetectionStrategy: true })

// for one container or component
@Container(html, { pessimisticChangeDetectionStrategy: true })
@Component(html, css, { pessimisticChangeDetectionStrategy: true })

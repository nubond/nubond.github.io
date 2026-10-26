import html from './page.html';                          // a file, bundled as a string

@Container(html)                                         // template string
@Container(['user-page', html])                          // with an explicit name
@Container({ get: () => '<p>Generated</p>' })            // a provider
@Container({ get: () => fetch('/t.html').then(r => r.text()) }) // an async provider
@Container('/templates/page.html')                       // a URL, fetched at runtime

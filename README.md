# @nubond/docs

The interactive nuBond documentation: short lessons with live, editable examples. Built with nuBond itself.

> 15 minutes and you know all the basics, 15 minutes more and you know everything.

## Quick start

```bash
npm install
npm start          # http://localhost:1234, regenerates content on every change
npm run build      # static site in ./dist (relative URLs: works from any sub-path)
npm run check      # type-checks the app and every example
```

Deployment: `.github/workflows/pages.yml` builds and publishes `dist` to GitHub Pages on every push to `main`
(Settings → Pages → Source: *GitHub Actions*).

## How it works

```
content/                      lesson material — plain files, no build knowledge needed
  <lesson>/<example>/         a live example: index.ts (+ index.html, more .ts/.html/.css files)
  <lesson>/<name>.<ext>       a static snippet (ts, html, css, json, sh, txt)
scripts/build-content.mjs     content/ → src/generated/content.ts (example TS precompiled)
src/
  index.html / index.ts       the app shell (@AppRoot, route '/#[page=introduction]')
  pages/                      one container per lesson; the container name is the route
  sandbox.html / sandbox.ts   the page every example runs in
  shared/
    components/               live-example, code-editor, code-view, doc-note
    services/                 catalog (lesson list), content store, compiler, theme, progress
    aspects/ transformers/ templates/ styles/
```

**Live examples.** `<live-example nb-in:name="@lists/todos">` shows the files of `content/lists/todos/` in an editor
and runs them in a fresh sandbox iframe — a separate nuBond instance per run, so examples never share the registry,
router or configuration. The iframe gets the files plus their compiled JavaScript; a tiny CommonJS loader resolves
`nubond` and the example's own files, `index.html` becomes the page body, and `{{ }}` is interpolated at runtime the
same way `@nubond/posthtml-value-interpolation` does at build time. `console` output and errors from the example are
shown under its result.

Examples are precompiled by `scripts/build-content.mjs`, so a page needs no compiler. After the first edit of a `.ts`
file the TypeScript compiler is loaded from jsDelivr (the version pinned in `src/shared/services/compiler.ts` —
keep it equal to the `typescript` devDependency).

## Adding a lesson

1. Add the lesson to `src/shared/services/catalog.ts` (id, title, minutes, filter keywords).
2. Create `src/pages/<id>.html` (`<article class="doc">…`) and add the container to `src/pages/pages.ts`.
3. Put examples into `content/<id>/`, reference them with `<live-example nb-in:name="@<id>/<example>">` —
   add `nb-in:open="@file.ts"` to open a file other than `index.html` — and snippets with
   `<code-view nb-in:name="@<id>/<file>">`.
4. Callouts: `<doc-note nb-in:kind="@tip|warn"><p nb-projection>…</p></doc-note>` — one element per note,
   since a note has a single default slot.

A section used by several lessons lives in `src/pages/shared/` and is registered once as a `$Template` in the `@AppRoot`
array (`src/index.ts`); lessons insert it with `<div nb-template="@inputs-outputs"></div>`.

Lesson templates go through the interpolation plugin: write `&#123;&#123;` for a literal `{{` in prose.

## License

[MIT](LICENSE) © Dmytro Tomayly

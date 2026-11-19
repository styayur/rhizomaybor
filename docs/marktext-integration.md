# MarkText and Muya integration

## Investigation

MarkText is an Electron application with a Vue 3 desktop interface and a TypeScript/JavaScript editor engine named Muya. Its license is MIT. Muya is distributed as a standalone browser library under `@muyajs/core` and is explicitly designed to be embedded in web hosts.

Rhizomaybor therefore does not embed the MarkText desktop application. It uses Muya as the MarkText-compatible visual Markdown engine, while retaining its own project model, component registry, publication controls and export pipeline.

## Integration

- `@muyajs/core` is loaded dynamically only when visual Markdown/MDX editing starts.
- The project still stores the original Markdown/MDX string.
- Applied Muya JSON changes are serialized with the actual `getMarkdown()` API.
- The autosaved indicator refers to the current project revision, not a previously saved edit.
- Source and isolated preview modes remain available.
- Muya failures show a fallback notice and do not modify the document.

## Why not convert all HTML to Markdown?

Markdown cannot represent every HTML structure or attribute. Converting an arbitrary HTML document would silently discard information.

HTML documents therefore use:

- an HTML-aware visual mode for supported safe structures;
- source mode for exact arbitrary HTML editing;
- an isolated, sanitized preview.

Unknown elements and attributes are analyzed and reported. The document’s `format` and `sourceFormat` remain `html`.

## Security

- Preview iframes use a sandbox with no script permission.
- DOMPurify sanitizes browser preview HTML.
- The Node renderer uses sanitize-html with matching safe tag and attribute policy.
- Scripts and event-handler attributes are removed from rendered output.
- Original source remains available only in the editor’s source mode.

## Limitations

Muya’s own documentation notes that its API may change between minor versions. Rhizomaybor pins a compatible version and covers visual startup, source preservation and preview mode with Playwright. A future Muya upgrade requires rerunning those tests and reviewing release notes.

## Web image paths

The Markdown editor resolves `/garden-assets/leaf.svg` beneath the deployed app
root, including `/rhizomaybor/` on GitHub Pages. Relative image URLs are based on
the current document's published URL, rather than the `/editor/` route. Inline
and reference images follow the same rule; switching to source mode retains the
original Markdown paths. Existing app-prefixed URLs are not prefixed twice.

HTTP(S) URLs and base64 image data are supported. OS drive paths, UNC shares,
`file:`, executable protocols, credentials and relative paths escaping the app
root are not loaded. A desktop project does not grant arbitrary filesystem
access to image content. Use project/public web assets or supported image data
instead of expecting a browser to read a local absolute path.

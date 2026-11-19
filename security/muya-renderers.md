# Muya renderer source rebuild

The npm `@muyajs/core` 0.2.0 distribution embeds Mermaid 11.15.0 chunks and two
KaTeX 0.16.47 copies. Changing its dependency resolution alone leaves those
implementations in the application. The editor accepts imported Markdown/MDX,
so diagram and math rendering are real runtime paths.

The local MIT workspace rebuilds the exact upstream v0.2.0 source at
`dfcdb8b757ff41c6e83950e86597daa86a8fc0b7`, preserving licenses and declaration
bytes. `muya-provenance.json` inventories the payload. The build verifies its
hashes and emits ESM/CJS with installed JavaScript dependencies external, so
Next bundles reviewed Mermaid 11.16.1 and KaTeX 0.18.2 instead of stale copies.
No original registry renderer chunks are copied. Two source imports use the
new KaTeX `contrib/mhchem` export, ensuring chemistry registers on the same ESM
or CJS renderer instance. All other upstream source bytes are preserved.
The workspace also shares the application's Marked 18 renderer, aligning the
`marked-highlight` peer type/runtime with its declared supported `<19` range;
strict checks and Markdown browser roundtrips validate this compatibility.
Fonts remain separate binary files using Vite's native no-inline asset query,
instead of increasing CSS by megabytes of base64. The artifact secret scan is
unchanged and continues checking all output.

`npm ci` rebuilds this workspace automatically. Product type checking remains
strict; upstream source is checked separately with its own unchanged strict
tsconfig. Unit tests exercise math/chemistry and inherited-trust restrictions.
Browser tests exercise the actual Muya editor, source preservation, valid
diagram/math rendering and three upstream malicious diagram inputs under
bounded test timeouts.

The five Mermaid advisories are fixed in 11.16.1: XY-chart range and radar tick
DoS, architecture prototype pollution, configuration API prototype pollution,
and CSS sibling escape. Muya already uses `securityLevel: strict`, controlled
configuration literals and `mermaid.run()` with a dedicated preview container;
these limit the configuration/CSS paths but do not prevent the chart DoS or
architecture bugs. KaTeX's read-side pollution gadget requires existing
pollution; patched own-property checks remove the inherited-trust behavior.

PostCSS selector-parser 6.x is scoped to its compatible patched 6.1.5 release.
Its actual consumers are Tailwind/typography during trusted-source builds,
with no imported user selector parsing in the editor runtime. Existing CSS,
publication-boundary, editor, archive and native packaging checks remain
enabled. No advisories are dismissed and no audit policy is weakened.

Sources: upstream [Muya tag](https://github.com/marktext/muya/tree/dfcdb8b757ff41c6e83950e86597daa86a8fc0b7),
[Mermaid 11.16.1](https://github.com/mermaid-js/mermaid/releases/tag/mermaid%4011.16.1),
[KaTeX advisory](https://github.com/KaTeX/KaTeX/security/advisories/GHSA-238p-pmpm-9mq7),
[selector-parser advisory](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

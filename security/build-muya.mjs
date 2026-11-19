import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { build } from 'vite';

const root = fileURLToPath(new URL('../', import.meta.url));
const vendor = path.join(root, 'vendor/muya-core');
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'security/muya-provenance.json'), 'utf8'));
for (const [relative, expected] of Object.entries(provenance.files)) {
  const actual = crypto.createHash('sha256').update(fs.readFileSync(path.join(vendor, relative))).digest('hex');
  if (actual !== expected) throw new Error(`Muya upstream byte mismatch: ${relative}`);
}
const pkg = JSON.parse(fs.readFileSync(path.join(vendor, 'package.json'), 'utf8'));
const dependencies = Object.keys(pkg.dependencies);
// Retain imports of reviewed installed renderers. The registry release bundled
// old Mermaid/KaTeX, which cannot be fixed by changing a lockfile alone.
const external = (id) => !id.endsWith('.css') && dependencies.some((name) => id === name || id.startsWith(`${name}/`));
await build({
  configFile: false,
  root: vendor,
  publicDir: false,
  build: {
    target: 'chrome70',
    outDir: 'lib/generated',
    emptyOutDir: true,
    lib: {
      entry: path.join(vendor, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'es/index.js' : 'cjs/index.cjs',
      cssFileName: 'core',
    },
    rollupOptions: { external },
  },
});
for (const relative of ['lib/generated/es/index.js', 'lib/generated/cjs/index.cjs']) {
  const source = fs.readFileSync(path.join(vendor, relative), 'utf8');
  if (/0\.16\.47|11\.15\.0|mermaid\.core-/.test(source)) throw new Error(`Bundled vulnerable renderer in ${relative}`);
  if (!source.includes('katex') || !source.includes('mermaid')) throw new Error(`Missing external renderer imports in ${relative}`);
}
process.stdout.write(`Verified and rebuilt Muya from ${provenance.upstreamCommit}; installed renderers remain external.\n`);

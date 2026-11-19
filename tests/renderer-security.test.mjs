import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import katex from 'katex';
import 'katex/contrib/mhchem';

test('the Muya workspace uses patched math and keeps ordinary and chemistry syntax', () => {
  const requireMuya = createRequire(new URL('../vendor/muya-core/package.json', import.meta.url));
  const readPackage = (name) => JSON.parse(fs.readFileSync(requireMuya.resolve(`${name}/package.json`), 'utf8'));
  assert.equal(readPackage('katex').version, '0.18.2');
  assert.equal(readPackage('mermaid').version, '11.16.1');
  assert.equal(katex.version, '0.18.2');
  for (const source of [String.raw`x^2 + \frac{1}{2}`, String.raw`\ce{H2O}`]) {
    assert.match(katex.renderToString(source, { throwOnError: true }), /class="katex"/);
  }
});

test('inherited trust cannot enable JavaScript links in math output', () => {
  const previous = Object.getOwnPropertyDescriptor(Object.prototype, 'trust');
  let output;
  try {
    Object.defineProperty(Object.prototype, 'trust', { configurable: true, writable: true, value: true });
    // Muya passes an ordinary options object with displayMode but no trust key.
    output = katex.renderToString(String.raw`\href{javascript:alert(1)}{click}`, { displayMode: true });
  } finally {
    if (previous) Object.defineProperty(Object.prototype, 'trust', previous);
    else delete Object.prototype.trust;
  }
  assert.doesNotMatch(output, /<a\b|href=["']javascript:/i);
  assert.match(katex.renderToString(String.raw`\href{https://example.com}{safe}`, { trust: true }), /href="https:\/\/example.com"/);
});

import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';
import { REPO_ROOT } from '../scripts/lib/content-utils.mjs';

test('artifact secret failures retain the gate and report paths without candidate values', () => {
  const staging = path.resolve(REPO_ROOT, '.build');
  fs.mkdirSync(staging, { recursive: true });
  const output = fs.mkdtempSync(path.join(staging, 'audit-regression-'));
  const run = () => spawnSync(process.execPath, ['scripts/artifact-audit.mjs', '--output', output, '--source', 'fixtures/content'], { cwd: REPO_ROOT, encoding: 'utf8', timeout: 30_000 });
  try {
    fs.writeFileSync(path.join(output, 'index.html'), '<p>Approved public fixture.</p>');
    assert.equal(run().status, 0);
    // Synthetic format-only marker; never a usable credential.
    const candidate = ['AK', 'IA', '0'.repeat(16)].join('');
    for (const name of ['first.css', 'second.css']) fs.writeFileSync(path.join(output, name), candidate);
    const failure = run();
    assert.notEqual(failure.status, 0);
    assert.match(failure.stderr, /AWS access key found in artifact text/);
    assert.match(failure.stderr, /first\.css/);
    assert.match(failure.stderr, /second\.css/);
    assert.equal(failure.stderr.includes(candidate), false);
  } finally {
    assert.ok(path.resolve(output).startsWith(`${staging}${path.sep}`));
    fs.rmSync(output, { recursive: true, force: true });
  }
});

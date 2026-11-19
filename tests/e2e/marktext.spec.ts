import { test, expect } from '@playwright/test';

async function editVisualSource(page: import('@playwright/test').Page, source: string) {
  await page.getByTestId('content-mode-source').click();
  await page.getByTestId('content-source-editor').fill(source);
  await page.getByTestId('content-mode-visual').click();
  await expect(page.locator('.marktext-editor')).not.toBeEmpty();
}

test('rebuilt Muya renders math, chemistry and Mermaid and preserves edited source', async ({ page }) => {
  await page.goto('/editor/');
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  const source = '# Renderer compatibility\n\nInline $x^2 + \\frac{1}{2}$.\n\n$$\n\\ce{H2O}\n$$\n\n```mermaid\nflowchart LR\nA[Garden] --> B[Published]\n```\n';
  await editVisualSource(page, source);
  await expect(page.locator('.marktext-editor .katex').first()).toBeVisible();
  await expect(page.locator('.mu-math-preview .katex')).toBeVisible();
  await expect(page.locator('.mu-diagram-preview svg')).toBeVisible();
  await expect(page.locator('.mu-diagram-preview')).toContainText('Published');
  await page.getByTestId('content-mode-source').click();
  await expect(page.getByTestId('content-source-editor')).toHaveValue(source);
});

test('untrusted Mermaid charts stay bounded and cannot pollute the editor realm', async ({ page }) => {
  test.setTimeout(60_000);
  await page.goto('/editor/');
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  // Upstream GHSA-2v8p, GHSA-rhh3 and GHSA-3rrr regression inputs.
  for (const diagram of [
    'xychart\n  x-axis 1 --> 1\n  line [1, 2]',
    'radar-beta\n  axis a, b\n  curve c {1, 1}\n  ticks 1000000000',
    'architecture-beta\n  group mermaidPrototypePollutionMarker(cloud)[Marker]\n  service a(server)[A] in __proto__\n  service b(server)[B] in mermaidPrototypePollutionMarker\n  a:R -- L:b',
  ]) {
    await editVisualSource(page, `# Untrusted chart\n\n\`\`\`mermaid\n${diagram}\n\`\`\`\n`);
    const preview = page.locator('.mu-diagram-preview');
    await expect(preview).not.toHaveText('Loading...', { timeout: 10_000 });
    // Either an error or a bounded SVG is acceptable for rejected inputs.
    expect(await preview.locator('*').count()).toBeLessThan(5000);
    expect(await page.evaluate(() => Object.prototype.hasOwnProperty.call(Object.prototype, 'mermaidPrototypePollutionMarker'))).toBe(false);
  }
});

test('MarkText-compatible visual engine mounts for Markdown and preserves source mode', async ({ page }) => {
  await page.goto('/editor/');
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  await expect(page.locator('.marktext-editor')).toBeVisible({ timeout: 30_000 });
  await expect(page.locator('.marktext-editor')).not.toBeEmpty();
  await page.getByTestId('content-mode-source').click();
  const source = await page.getByTestId('content-source-editor').inputValue();
  expect(source.length).toBeGreaterThan(20);
  expect(source).toMatch(/[A-Za-z]/);
  await page.getByTestId('content-mode-preview').click();
  await expect(page.getByTestId('content-preview')).toBeVisible();
});

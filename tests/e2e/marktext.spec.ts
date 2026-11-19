import { test, expect } from '@playwright/test';
import fs from 'node:fs';

async function editVisualSource(page: import('@playwright/test').Page, source: string) {
  await page.getByTestId('content-mode-source').click();
  await page.getByTestId('content-source-editor').fill(source);
  await page.getByTestId('content-mode-visual').click();
  await expect(page.locator('.marktext-editor')).not.toBeEmpty();
}

test('rebuilt Muya renders math, chemistry and Mermaid and preserves edited source', async ({ page }) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/editor/');
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  const source = '# Renderer compatibility\n\nInline $x^2 + \\frac{1}{2}$.\n\n$$\n\\ce{H2O}\n$$\n\n```mermaid\nflowchart LR\nA[Garden] --> B[Published]\n```\n\n```cpp\nint main() { return 0; }\n```\n';
  await editVisualSource(page, source);
  await expect(page.locator('.marktext-editor .katex').first()).toBeVisible();
  await expect(page.locator('.mu-math-preview .katex')).toBeVisible();
  await expect(page.locator('.mu-diagram-preview svg')).toBeVisible();
  await expect(page.locator('.mu-diagram-preview')).toContainText('Published');
  await expect(page.locator('.mu-codeblock-content').filter({ hasText: 'int main()' }).locator('.token.keyword').first()).toBeVisible();
  const contrast = await page.locator('.marktext-editor').evaluate(editor => {
    const text = getComputedStyle(editor.querySelector('h1')!).color.match(/[\d.]+/g)!.map(Number);
    const background = getComputedStyle(editor.parentElement!).backgroundColor.match(/[\d.]+/g)!.map(Number);
    const alpha = text[3] ?? 1;
    const foreground = text.slice(0, 3).map((value, i) => value * alpha + background[i] * (1 - alpha));
    const luminance = (rgb: number[]) => rgb.slice(0, 3).map(value => value / 255).map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4).reduce((sum, value, i) => sum + value * [.2126, .7152, .0722][i], 0);
    const a = luminance(foreground), b = luminance(background);
    return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
  });
  expect(contrast).toBeGreaterThanOrEqual(4.5);
  await page.getByTestId('content-mode-source').click();
  await expect(page.getByTestId('content-source-editor')).toHaveValue(source);
  expect(pageErrors).toEqual([]);
});

test('visual typing reaches source, applied project, autosave recovery and JSON download', async ({ page }, testInfo) => {
  const pageErrors: string[] = [];
  page.on('pageerror', error => pageErrors.push(error.message));
  await page.goto('/editor/');
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  await editVisualSource(page, '# Live editable heading\n\nSelf-authored acceptance fixture.\n');
  const heading = page.locator('.marktext-editor h1');
  await heading.click();
  await page.keyboard.press('End');
  const marker = ' Rhizo live editing verified';
  await page.keyboard.insertText(marker);
  await expect(heading).toHaveText(`Live editable heading${marker}`);
  await page.getByTestId('content-mode-source').click();
  const sourceEditor = page.getByTestId('content-source-editor');
  await expect(sourceEditor).toHaveValue(new RegExp(`# Live editable heading${marker}`));
  const editedSource = await sourceEditor.inputValue();
  await page.getByTestId('apply-content').click();
  await expect(page.getByText(/autosaved/)).toBeVisible({ timeout: 10_000 });
  await page.reload();
  await expect(page.getByText(/Recovered unsaved edits/)).toBeVisible();
  await page.getByRole('button', { name: 'Restore', exact: true }).click();
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  await page.getByTestId('content-mode-source').click();
  await expect(page.getByTestId('content-source-editor')).toHaveValue(editedSource);
  await page.getByRole('button', { name: 'Cancel', exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByTestId('save-project').click();
  const download = await downloadPromise;
  const projectPath = testInfo.outputPath('visual-edited-project.json');
  await download.saveAs(projectPath);
  const project = JSON.parse(fs.readFileSync(projectPath, 'utf8'));
  expect(JSON.stringify(project)).toContain(marker);
  expect(pageErrors).toEqual([]);
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

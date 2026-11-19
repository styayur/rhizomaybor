import { expect, type Page } from '@playwright/test';

export async function checkEditorImages(page: Page, basePath: string, origin?: string) {
  const forbidden: string[] = [];
  const errors: string[] = [];
  page.on('request', request => {
    if (/^(?:file|javascript):|^data:text\/html|invalid-image\.example/.test(request.url())) forbidden.push(request.url());
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(origin ? new URL(`${basePath}/editor/`, origin).href : `${basePath}/editor/`);
  await page.getByTestId('left-content-tab').click();
  await page.getByTestId('document-doc-post-building-a-garden').click();
  const leaf = page.locator('.marktext-editor img[alt="A simple leaf illustration"]');
  await expect(leaf).toBeVisible();
  await expect.poll(() => leaf.evaluate(image => (image as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
  expect(await leaf.getAttribute('src')).toBe(new URL(`${basePath}/garden-assets/leaf.svg`, page.url()).href);
  const leafUrl = new URL(`${basePath}/garden-assets/leaf.svg`, page.url()).href;
  const dataImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==';
  const source = '# Image resolution\n\n![Root leaf](/garden-assets/leaf.svg)\n\n![Document leaf](../../garden-assets/leaf.svg)\n\n![Prefixed leaf](' + basePath + '/garden-assets/leaf.svg)\n\n![Absolute leaf](' + leafUrl + ')\n\n![Data pixel](' + dataImage + ')\n\n![Reference leaf][leaf]\n\n[leaf]: ../../garden-assets/leaf.svg\n\n![Disk](file:///fixture/private.svg)\n\n![Drive](C:/fixture/private.svg)\n\n![Script](javascript:window.imageSourceExecuted=true)\n\n![Encoded](%6aavascript%3Awindow.imageSourceExecuted=true)\n\n![HTML](data:text/html;base64,PHNjcmlwdD4=)\n\n![Network](//invalid-image.example/unsafe.svg)\n';
  await page.getByTestId('content-mode-source').click();
  await page.getByTestId('content-source-editor').fill(source);
  await page.getByTestId('content-mode-visual').click();
  for (const alt of ['Root leaf', 'Document leaf', 'Prefixed leaf', 'Absolute leaf', 'Data pixel', 'Reference leaf']) {
    const image = page.locator(`.marktext-editor img[alt="${alt}"]`);
    await expect(image).toBeVisible();
    await expect.poll(() => image.evaluate(element => (element as HTMLImageElement).naturalWidth)).toBeGreaterThan(0);
    expect(await image.getAttribute('src')).toBe(alt === 'Data pixel' ? dataImage : leafUrl);
  }
  expect(await page.evaluate(() => Object.hasOwn(window, 'imageSourceExecuted'))).toBe(false);
  await page.getByTestId('content-mode-source').click();
  await expect(page.getByTestId('content-source-editor')).toHaveValue(source);
  expect(forbidden).toEqual([]);
  expect(errors).toEqual([]);
}

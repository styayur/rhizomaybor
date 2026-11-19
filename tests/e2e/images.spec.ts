import { test } from '@playwright/test';
import { checkEditorImages } from './image-checks';

test('web image sources decode with root/document context and block filesystem/protocol escapes', async ({ page }) => {
  await checkEditorImages(page, '');
});

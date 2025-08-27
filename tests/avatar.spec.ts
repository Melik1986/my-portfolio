import { test, expect } from '@playwright/test';

test('3D Avatar container renders and canvas is present', async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => document.dispatchEvent(new CustomEvent('preloader:complete')));
  await page.locator('[data-preloader-root]').waitFor({ state: 'detached' });
  await page.addStyleTag({ content: '*{animation:none !important;transition:none !important}' });

  // Scroll to About section where avatar is located
  await page.evaluate(() => document.getElementById('about-section')?.scrollIntoView());

  const container = page.locator('#avaturn-container');
  await expect(container).toBeVisible();

  // Wait briefly for three to initialize and append canvas
  await page.waitForTimeout(500);
  const canvas = container.locator('canvas');
  await expect(canvas).toHaveCount(1);
});

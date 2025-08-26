import { test, expect } from '@playwright/test';

test.describe('i18n language switching', () => {
  test('renders English by default and switches to Russian', async ({ page }) => {
    await page.goto('/');

    // Default EN: hidden headings still present in DOM
    await expect(page.locator('h2.visually-hidden', { hasText: "Hi, I'm" })).toHaveCount(1);

    // Click language switcher RU
    await page.getByRole('button', { name: 'RU' }).click();
    await page.waitForLoadState('domcontentloaded');

    // Verify Russian hero title
    await expect(page.locator('h2.visually-hidden', { hasText: 'Привет, это' })).toHaveCount(1);

    // Verify a couple more texts
    await expect(page.locator('text=Навыки и экспертиза')).toHaveCount(1);
    await expect(page.locator('text=Каталог проектов')).toHaveCount(1);

    // Switch back to EN
    await page.getByRole('button', { name: 'EN' }).click();
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('h2.visually-hidden', { hasText: "Hi, I'm" })).toHaveCount(1);
  });
});


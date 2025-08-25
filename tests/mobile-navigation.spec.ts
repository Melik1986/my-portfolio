import { test, expect } from '@playwright/test';

test.describe('Mobile navigation behavior', () => {
  test('is hidden on mobile and opens via button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');

    const navList = page.locator('#header .header__navigation');
    await expect(navList).toBeHidden();

    const toggleButton = page.getByRole('button', { name: 'Contact me' });
    await toggleButton.click();

    const mobilePanel = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobilePanel).toBeVisible();

    // aria-expanded should reflect open state
    await expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

    const overlay = page.getByRole('button', { name: 'Close navigation' });
    await overlay.click();

    await expect(mobilePanel).toHaveCount(0);
  });

  test('desktop does not open mobile panel', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const navList = page.locator('#header .header__navigation');
    await expect(navList).toBeVisible();

    const toggleButton = page.getByRole('button', { name: 'Contact me' });
    await toggleButton.click();

    const mobilePanel = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobilePanel).toHaveCount(0);
  });
});


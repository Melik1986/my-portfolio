import { test, expect } from '@playwright/test';

test.describe('Mobile navigation behavior', () => {
  test('is hidden on mobile and opens via button', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto('/');

    const navList = page.getByTestId('desktop-nav');
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

    const navList = page.getByTestId('desktop-nav');
    await expect(navList).toBeVisible();

    const toggleButton = page.getByRole('button', { name: 'Contact me' });
    await toggleButton.click();

    const mobilePanel = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobilePanel).toHaveCount(0);
  });

  test('transitions correctly on desktop→mobile→desktop resize', async ({ page }) => {
    // Start on desktop
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.goto('/');

    const desktopNav = page.getByTestId('desktop-nav');
    await expect(desktopNav).toBeVisible();

    // Resize down to mobile and verify desktop nav hides
    await page.setViewportSize({ width: 375, height: 800 });
    await expect(desktopNav).toBeHidden();

    // Open mobile panel
    const toggleButton = page.getByRole('button', { name: 'Contact me' });
    await toggleButton.click();
    const mobilePanel = page.getByRole('navigation', { name: 'Mobile navigation' });
    await expect(mobilePanel).toBeVisible();

    // Resize back to desktop: dropdown should close and desktop nav show again
    await page.setViewportSize({ width: 1280, height: 900 });
    await expect(mobilePanel).toHaveCount(0);
    await expect(desktopNav).toBeVisible();
  });
});


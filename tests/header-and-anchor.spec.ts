import { test, expect } from '@playwright/test';

test.describe('Header button and navigation behavior', () => {
  test('Desktop: header button navigates to contact section', async ({ page }) => {
    await page.goto('/');
    // Wait for preloader to finish if it appears
    await page.waitForTimeout(500);
    const btn = page.getByRole('button', { name: /contact me/i });
    await btn.click();
    await page.waitForTimeout(500);
    await expect(page.locator('#contact-section')).toBeVisible();
  });

  test('Mobile: header button toggles mobile navigation dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.waitForTimeout(500);
    const mobileBtn = page.getByRole('button', { name: /navigation/i });
    await mobileBtn.click();
    const dropdown = page.locator('#mobile-nav-panel');
    await expect(dropdown).toBeVisible();

    // Clicking overlay closes
    await page.locator('button.header__overlay').click();
    await expect(dropdown).toBeHidden();
  });
});

test.describe('Anchor button behavior', () => {
  test('Anchor button remains visible across resizes and scrolls to top', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(500);

    const anchor = page.locator('button.anchor-button');
    await expect(anchor).toBeVisible();

    // Scroll down and ensure still visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(anchor).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(anchor).toBeVisible();

    // Click to scroll to top
    await anchor.click();
    await page.waitForTimeout(200);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(50);
  });
});


import { test, expect } from '@playwright/test';

async function disableAnimations(page: import('@playwright/test').Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after { transition: none !important; animation: none !important; }
      html { scroll-behavior: auto !important; }
    `,
  });
}

test.describe('Header button and navigation behavior', () => {
  test('Desktop: header button navigates to contact section', async ({ page }) => {
    await page.goto('/');
    // Dismiss preloader to avoid overlay blocking clicks
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('preloader:complete')));
    await page.locator('[data-preloader-root]').waitFor({ state: 'detached' });
    await disableAnimations(page);
    const btn = page.getByRole('button', { name: /contact me/i });
    await btn.click();
    await page.waitForTimeout(800);
    // Assert either deck scrolled near contact or content is visible
    const contactContainer = page.locator('#contact-content');
    await expect(contactContainer).toBeVisible();
  });

  test('Mobile: header button toggles mobile navigation dropdown', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('preloader:complete')));
    await page.locator('[data-preloader-root]').waitFor({ state: 'detached' });
    await disableAnimations(page);
    // Target the contact button directly; on mobile it toggles navigation
    const mobileBtn = page.getByTestId('header-contact-button');
    await expect(mobileBtn).toBeVisible();
    await mobileBtn.click();
    const dropdown = page.locator('#mobile-nav-panel');
    await expect(dropdown).toBeVisible();

    // Close via Escape to align with hook behavior
    await page.keyboard.press('Escape');
    await expect(dropdown).toBeHidden();
  });
});

test.describe('Anchor button behavior', () => {
  test('Anchor button remains visible across resizes and scrolls to top', async ({ page }) => {
    await page.goto('/');
    await page.evaluate(() => document.dispatchEvent(new CustomEvent('preloader:complete')));
    await page.locator('[data-preloader-root]').waitFor({ state: 'detached' });
    await disableAnimations(page);

    const anchor = page.getByRole('button', { name: /scroll to top/i });
    await expect(anchor).toBeVisible();

    // Scroll down and ensure still visible
    await page.evaluate(() => window.scrollTo(0, 1000));
    await expect(anchor).toBeVisible();

    // Resize to mobile
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(anchor).toBeVisible();

    // Click to scroll to top
    await anchor.click();
    await page.waitForTimeout(250);
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeLessThan(80);
  });
});


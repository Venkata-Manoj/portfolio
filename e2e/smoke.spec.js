import { test, expect } from '@playwright/test';

test('page has a title set', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Manoj|Engineer|Data/, { timeout: 15000 });
});

test('hero section renders a heading', async ({ page }) => {
  await page.goto('/');
  const heading = page.locator('h1, h2').first();
  await expect(heading).toBeVisible({ timeout: 10000 });
});

test('navigation is present', async ({ page }) => {
  await page.goto('/');
  const navItems = page.locator('header a, header button, [role="navigation"] a');
  const count = await navItems.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

test('at least one content section renders', async ({ page }) => {
  await page.goto('/');
  const sections = page.locator('section');
  const count = await sections.count();
  expect(count).toBeGreaterThanOrEqual(1);
});

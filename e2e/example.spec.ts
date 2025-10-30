import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('should load the home page', async ({ page }) => {
    await page.goto('/');
    // Wait for Angular to load
    await page.waitForLoadState('networkidle');
    
    // Debug: Log the actual title
    const title = await page.title();
    console.log('Page title:', title);
    
    // Check for the correct title
    await expect(page).toHaveTitle('Conduit');
  });

  test('should display navigation', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    // Wait for Angular components to render
    await page.waitForSelector('app-header, header', { timeout: 10000 });
    const header = page.locator('app-header').or(page.locator('header'));
    await expect(header).toBeVisible();
  });

  test('debug page content', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Log page info
    const title = await page.title();
    const url = page.url();
    console.log('Page title:', title);
    console.log('Page URL:', url);
    
    // Check if Angular app root exists
    const appRoot = await page.locator('app-root').count();
    console.log('app-root elements found:', appRoot);
    
    // Check for any visible content
    const bodyText = await page.locator('body').textContent();
    console.log('Body text content:', bodyText);
    
    // Log the page content
    const content = await page.content();
    console.log('Page content length:', content.length);
    console.log('Page content preview:', content.substring(0, 500));
    
    // Take a screenshot
    await page.screenshot({ path: 'debug-screenshot.png' });
  });
});
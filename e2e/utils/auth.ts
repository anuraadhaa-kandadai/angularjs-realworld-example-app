// e2e/utils/auth.ts
import { Page, expect } from '@playwright/test';

export async function loginViaUI(page: Page, email?: string, password?: string) {
  if (!email || !password) {
    throw new Error('Missing PW_USER_EMAIL/PW_USER_PASSWORD');
  }
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page.getByRole('link', { name: 'New Article' })).toBeVisible({ timeout: 10000 });
}
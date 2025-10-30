import { test, expect } from '@playwright/test';
import { loginViaUI } from './utils/auth';

const email = process.env['PW_USER_EMAIL'];
const password = process.env['PW_USER_PASSWORD'];

test.describe('Create New Article - Basic Flow', () => {
  test.beforeEach(async ({ page }) => {
    test.skip(!email || !password, 'Set PW_USER_EMAIL and PW_USER_PASSWORD');
    await loginViaUI(page, email, password);
  });

  test('should display and interact with the new article creation form', async ({ page }) => {
    // Given I am a signed-in user
    // When I navigate to the new article creation form
    await page.goto('/'); // Start from the home page
    await page.getByRole('link', { name: 'New Article' }).click();

    // Then I should see a form with the following fields:
    await expect(page.getByPlaceholder('Article Title')).toBeVisible();
    await expect(page.getByPlaceholder("What's this article about?")).toBeVisible();
    await expect(page.getByPlaceholder('Write your article (in markdown)')).toBeVisible();
    await expect(page.getByPlaceholder('Enter tags')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Publish Article' })).toBeVisible();

    // Additional interactions to ensure form functionality
    await page.getByPlaceholder('Article Title').fill('Test Article');
    await page.getByPlaceholder("What's this article about?").fill('This is a test description');
    await page.getByPlaceholder('Write your article (in markdown)').fill('This is the body of the test article');
    
    // Add a tag
    await page.getByPlaceholder('Enter tags').fill('test');
    await page.getByPlaceholder('Enter tags').press('Enter');
    await expect(page.getByText('test')).toBeVisible();

    // Submit the form
    await Promise.all([
      page.waitForURL(/\/article\/.+/),
      page.locator('form').evaluate((form) => (form as HTMLFormElement).requestSubmit()),
    ]);

    // Verify we're on the article page
    await expect(page.getByRole('heading', { name: 'Test Article' })).toBeVisible();
  });
});
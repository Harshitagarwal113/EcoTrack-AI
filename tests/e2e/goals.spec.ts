import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Goal Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/goals');
  });

  test('can create a new custom goal', async ({ page }) => {
    // Intercept the API to prevent actual DB writes
    await page.route('**/rest/v1/goals*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201, body: JSON.stringify({}) });
      }
      return route.fulfill({ status: 200, body: JSON.stringify([]) });
    });

    await page.getByRole('button', { name: 'Create Custom Goal' }).click();

    // Verify modal is open
    await expect(page.getByText('Create New Goal')).toBeVisible();

    // Fill the form
    await page.getByPlaceholder('e.g., Bike to work twice a week').fill('E2E Test Goal');
    await page.getByPlaceholder('e.g., Reduce transport emissions').fill('Test description');
    await page.getByPlaceholder('Target Value').fill('10');
    
    // Click Add Goal
    await page.getByRole('button', { name: 'Add Goal' }).click();

    // Verify UI closes modal and shows toast
    await expect(page.getByText('Goal created successfully')).toBeVisible();
  });
});

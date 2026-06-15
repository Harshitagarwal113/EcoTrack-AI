import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Goal Management', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/goals');
  });

  test('can create a new custom goal', async ({ page }) => {
    // Intercept the API to prevent actual DB writes and simulate success response
    await page.route('**/api/report*', async (route) => {
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ success: true }) });
    });
    
    // In our goals page service layer:
    // createGoal sends a POST to carbon_entries or goal table or /api/goals etc.
    // Let's mock the supabase client's response or API calls
    await page.route('**/rest/v1/goals*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ 
          status: 201, 
          contentType: 'application/json', 
          body: JSON.stringify({ success: true }) 
        });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    await page.getByRole('button', { name: 'Set Goal' }).click();

    // Verify modal is open
    await expect(page.getByText('Set New Goal')).toBeVisible();

    // Fill the form
    await page.getByPlaceholder('e.g. Reduce meat consumption').fill('E2E Test Goal');
    await page.locator('#goal-target').fill('15');
    await page.locator('#goal-duration').selectOption('30');
    
    // Click Create Goal
    await page.getByRole('button', { name: 'Create Goal' }).click();

    // Verify modal is closed
    await expect(page.getByText('Set New Goal')).not.toBeVisible();
  });
});

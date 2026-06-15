import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Carbon Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/dashboard');
  });

  test('opens tracking modal and logs an entry', async ({ page }) => {
    // Click the FAB to open the tracking modal
    await page.getByRole('button', { name: 'add' }).click();

    // Ensure the modal is visible
    await expect(page.getByText('Log Activity')).toBeVisible();

    // Mock the Supabase insert API call
    await page.route('**/rest/v1/carbon_entries*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ status: 201, body: JSON.stringify({}) });
      }
      return route.continue();
    });

    // Fill out the form
    await page.getByText('Transport').click();
    await page.getByPlaceholder('Distance (km)').fill('15');
    
    // Submit the form
    await page.getByRole('button', { name: /Save Activity/i }).click();

    // Wait for the modal to close or a toast to appear
    await expect(page.getByText('Activity logged successfully')).toBeVisible();
  });
});

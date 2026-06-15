import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Carbon Tracking', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/tracker');
  });

  test('opens tracking page and logs an entry', async ({ page }) => {
    // Intercept the Supabase insert API call
    await page.route('**/rest/v1/carbon_entries*', async (route) => {
      if (route.request().method() === 'POST') {
        return route.fulfill({ 
          status: 201, 
          contentType: 'application/json', 
          body: JSON.stringify({ success: true }) 
        });
      }
      return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify([]) });
    });

    // Mock factors request (which mounts in useEffect)
    await page.route('**/rest/v1/emission_factors*', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { category: 'transportation', type: 'car', factor: 0.2 },
          { category: 'energy', type: 'electricity', factor: 0.5 }
        ])
      });
    });

    // Verify the page title
    await expect(page.locator('h1', { hasText: 'Carbon Tracker' })).toBeVisible();

    // Fill out the car distance input (first input in the list)
    const carInput = page.locator('input[type="number"]').first();
    await carInput.fill('15');

    // Click the submit button
    const submitBtn = page.getByRole('button', { name: 'Log Activity' });
    await submitBtn.click();

    // Verify successful save message on button
    await expect(page.getByRole('button', { name: 'Saved Successfully!' })).toBeVisible();
  });
});

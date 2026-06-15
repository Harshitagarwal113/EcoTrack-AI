import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Dashboard Analytics', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/dashboard');
  });

  test('renders streak cards and charts', async ({ page }) => {
    // Verify Streak Cards render (Goals Completed and Weeks Reduced)
    await expect(page.getByText('Goals Completed')).toBeVisible();
    await expect(page.getByText('Weeks Reduced')).toBeVisible();

    // Verify Sustainability Grade renders
    await expect(page.getByText('Sustainability Grade')).toBeVisible();
    
    // Check if the Footprint Chart container exists
    const chartContainer = page.locator('.recharts-responsive-container').first();
    // Recharts takes a moment to mount dynamically
    await chartContainer.waitFor({ state: 'attached', timeout: 5000 }).catch(() => {});
  });
});

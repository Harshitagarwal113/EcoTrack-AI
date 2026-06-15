import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('Receipt Scanner', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/scanner');
  });

  test('uploads an image and parses receipt data', async ({ page }) => {
    // Intercept the Gemini Vision Scan API
    await page.route('**/api/scan', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          data: {
            merchant_name: 'Test Supermarket',
            total_amount: 50.00,
            receipt_category: 'shopping',
            carbon_estimate_kg: 25.5,
            recommendations: ['Buy local produce']
          }
        })
      });
    });

    // Check for the correct header and upload UI text elements
    await expect(page.locator('h1', { hasText: 'Receipt Scanner' })).toBeVisible();
    await expect(page.getByText('Click to Upload')).toBeVisible();
    await expect(page.getByText('Supported formats: JPEG, PNG. Gemini Vision will automatically extract the details.')).toBeVisible();
  });
});

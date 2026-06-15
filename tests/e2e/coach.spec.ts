import { test, expect } from '@playwright/test';
import { mockAuthenticatedSession } from './test-utils';

test.describe('AI Coach Flow', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthenticatedSession(page);
    await page.goto('/coach');
  });

  test('can send a message and receive an AI response', async ({ page }) => {
    // Intercept the AI Chat API
    await page.route('**/api/chat', async (route) => {
      // Mock a streaming response format
      await route.fulfill({
        status: 200,
        contentType: 'text/plain',
        body: '0:"Hello! I am your AI Coach. How can I help you reduce your carbon footprint today?"\n'
      });
    });

    const input = page.getByPlaceholder('Ask about sustainability...');
    await input.fill('How do I reduce my footprint?');
    await page.keyboard.press('Enter');

    // Wait for the AI response to appear in the DOM
    await expect(page.getByText('Hello! I am your AI Coach. How can I help you reduce your carbon footprint today?')).toBeVisible({ timeout: 5000 });
  });
});

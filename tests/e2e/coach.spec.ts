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
      console.log('=== PLAYWRIGHT INTERCEPTED /api/chat ===');
      // Mock a streaming response format matching the AI SDK uiMessageChunkSchema and SSE protocol
      const chunks = [
        `data: ${JSON.stringify({ type: 'text-start', id: 'msg-1' })}`,
        `data: ${JSON.stringify({ type: 'text-delta', id: 'msg-1', delta: 'Hello! I am your AI Coach. How can I help you reduce your carbon footprint today?' })}`,
        `data: ${JSON.stringify({ type: 'text-end', id: 'msg-1' })}`,
        `data: [DONE]`
      ].join('\n\n') + '\n\n';
      await route.fulfill({
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Vercel-AI-UI-Message-Stream': 'v1'
        },
        body: chunks
      });
    });

    const input = page.getByPlaceholder('Ask about your footprint or request a goal...');
    await input.fill('How do I reduce my footprint?');
    await page.keyboard.press('Enter');

    // Wait for the AI response to appear in the DOM
    await expect(page.getByText('Hello! I am your AI Coach. How can I help you reduce your carbon footprint today?')).toBeVisible({ timeout: 5000 });
  });
});

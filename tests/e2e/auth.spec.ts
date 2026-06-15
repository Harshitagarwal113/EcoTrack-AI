import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page renders correctly and has Google login button', async ({ page }) => {
    // Navigate to the root, which should redirect to login if unauthenticated
    await page.goto('/');
    
    // Verify redirection to /auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);

    // Check for the Google login button
    const googleBtn = page.getByRole('button', { name: /continue with google/i });
    await expect(googleBtn).toBeVisible();

    // Verify brand text is visible
    await expect(page.getByText('EcoTrack AI')).toBeVisible();
    await expect(page.getByText('Start your sustainability journey today.')).toBeVisible();
  });
});

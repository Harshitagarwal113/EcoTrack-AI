import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {
  test('login page renders correctly and has Google login button', async ({ page }) => {
    // Navigate directly to /auth/login
    await page.goto('/auth/login');
    
    // Verify we are on /auth/login
    await expect(page).toHaveURL(/.*\/auth\/login/);

    // Check for the Google login button
    const googleBtn = page.getByRole('button', { name: /continue with google/i });
    await expect(googleBtn).toBeVisible();

    // Verify brand terms and headers are visible
    await expect(page.getByText('Welcome Back')).toBeVisible();
    await expect(page.getByText(/Sign in to access your dashboard/i)).toBeVisible();
  });
});

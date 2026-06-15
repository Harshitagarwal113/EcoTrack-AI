import { Page } from '@playwright/test';

// Mocks the Supabase authenticated session and standard dashboard data
export async function mockAuthenticatedSession(page: Page) {
  // Mock the auth user
  await page.route('**/auth/v1/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 'mock-user-123',
        aud: 'authenticated',
        role: 'authenticated',
        email: 'test@example.com',
        created_at: new Date().toISOString()
      }),
    });
  });

  // Mock profile data
  await page.route('**/rest/v1/profiles*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([{
        id: 'mock-user-123',
        email: 'test@example.com',
        full_name: 'Eco Tester',
        sustainability_grade: 'A',
        total_carbon_saved: 120
      }]),
    });
  });

  // Mock dashboard stats/streaks/goals to prevent hanging
  await page.route('**/rest/v1/streaks*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { streak_type: 'completed_goals', current_streak: 2, longest_streak: 5 },
        { streak_type: 'carbon_reductions', current_streak: 4, longest_streak: 4 }
      ]),
    });
  });

  await page.route('**/rest/v1/goals*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });

  await page.route('**/rest/v1/carbon_entries*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([]),
    });
  });
  
  // Set a dummy sb- access token cookie to bypass middleware checks
  await page.context().addCookies([
    {
      name: 'sb-access-token',
      value: 'dummy-token',
      domain: 'localhost',
      path: '/',
    },
    {
      name: 'sb-refresh-token',
      value: 'dummy-token',
      domain: 'localhost',
      path: '/',
    }
  ]);
}

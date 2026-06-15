# EcoTrack AI - Playwright E2E Tests

This directory contains the End-to-End (E2E) testing suite for EcoTrack AI, built using [Playwright](https://playwright.dev/).

## Test Coverage
We have automated the 6 most critical user journeys:
1. **Authentication** (`auth.spec.ts`)
2. **Dashboard Analytics** (`dashboard.spec.ts`)
3. **Carbon Tracking** (`tracking.spec.ts`)
4. **AI Coach** (`coach.spec.ts`)
5. **Receipt Scanner** (`scanner.spec.ts`)
6. **Goal Creation** (`goals.spec.ts`)

## How to Run Tests Locally

Before running tests, ensure your local development server dependencies are installed:
```bash
npm install
```

**Run all tests in headless mode:**
```bash
npx playwright test
```

**Run tests with the UI viewer (Recommended for debugging):**
```bash
npx playwright test --ui
```

**View the HTML Report:**
```bash
npx playwright show-report
```

## Authentication Mocking
Because standard Google OAuth popups block headless browsers via CAPTCHAs and bot protection, we use a utility function `mockAuthenticatedSession` in `test-utils.ts`. 
This function intercepts calls to the Supabase API and injects dummy user data, allowing the Playwright browser to test the authenticated application flawlessly without needing real Google credentials.

## Continuous Integration (CI)
These tests run automatically via GitHub Actions on every push and pull request to the `main` branch. See `.github/workflows/playwright.yml` for details.

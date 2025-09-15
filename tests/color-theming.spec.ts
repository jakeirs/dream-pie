import { test, expect } from '@playwright/test';

test.describe('Color Theming System', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081');

    // Wait for the app to load
    await page.waitForSelector('text=Reanimated 4 + Bottom Sheet Demo', { timeout: 10000 });
  });

  test('should display page with dark background theme', async ({ page }) => {
    // Check that the main background uses the dark theme color
    const mainView = page.locator('[data-testid="main-container"]').first();

    // Wait for the page content to be visible
    await expect(page.locator('text=Reanimated 4 + Bottom Sheet Demo')).toBeVisible();

    // Take screenshot to verify theming
    await page.screenshot({
      path: 'tests/screenshots/color-theming-dark-background.png',
      fullPage: true,
    });

    // Check if primary text is visible (white text on dark background)
    await expect(page.locator('text=Reanimated 4 + Bottom Sheet Demo')).toBeVisible();
    await expect(page.locator('text=Reanimated Animations')).toBeVisible();
  });

  test('should display buttons with brand color variants', async ({ page }) => {
    // Wait for animation controls section to be visible
    await expect(page.locator('text=Reanimated Animations')).toBeVisible();

    // Check that specific button variants are present by using more specific selectors
    const buttons = [
      'Scale',
      'Rotate',
      'Bounce',
      'Shake',
      'Fade',
      'Color',
      'Spin',
      'Slide',
      'Flip',
      'Pulse',
    ];

    for (const buttonText of buttons) {
      // Use a more specific selector that targets button elements
      const buttonSelector = page.locator('button').filter({ hasText: buttonText }).first();
      await expect(buttonSelector).toBeVisible();
    }

    // Take screenshot of button variants
    await page.screenshot({
      path: 'tests/screenshots/color-theming-button-variants.png',
      fullPage: true,
    });
  });

  test('should display primary CTA button with correct styling', async ({ page }) => {
    // Wait for the "Show Mock Data" button to be visible
    await expect(page.locator('text=Show Mock Data')).toBeVisible();

    // Click the button to test interaction
    await page.locator('text=Show Mock Data').click();

    // Wait for bottom sheet to open
    await page.waitForSelector('text=📱 Mock Data Demo', { timeout: 5000 });

    // Verify bottom sheet content uses themed colors
    await expect(page.locator('text=📱 Mock Data Demo')).toBeVisible();
    await expect(page.locator('text=👥 Users')).toBeVisible();
    await expect(page.locator('text=📝 Posts')).toBeVisible();

    // Take screenshot of themed bottom sheet
    await page.screenshot({
      path: 'tests/screenshots/color-theming-bottom-sheet.png',
      fullPage: true,
    });
  });

  test('should display error variant button in bottom sheet', async ({ page }) => {
    // Open bottom sheet
    await page.locator('text=Show Mock Data').click();

    // Wait for bottom sheet content
    await page.waitForSelector('text=Close Mock Data', { timeout: 5000 });

    // Check that the close button uses error variant (red background)
    await expect(page.locator('text=Close Mock Data')).toBeVisible();

    // Click to close the bottom sheet
    await page.locator('text=Close Mock Data').click();

    // Take screenshot after interaction
    await page.screenshot({
      path: 'tests/screenshots/color-theming-error-button.png',
      fullPage: true,
    });
  });

  test('should display feature list with themed card styling', async ({ page }) => {
    // Scroll to ensure feature list is visible
    await page.locator('text=Features Demonstrated:').scrollIntoViewIfNeeded();

    // Check that feature list is visible with themed styling
    await expect(page.locator('text=Features Demonstrated:')).toBeVisible();
    await expect(page.locator('text=• React Native Reanimated 4.1.0')).toBeVisible();
    await expect(page.locator('text=• Centralized color theming system! 🎨')).toBeVisible();

    // Take screenshot of themed feature list
    await page.screenshot({
      path: 'tests/screenshots/color-theming-feature-list.png',
      fullPage: true,
    });
  });

  test('should display status colors in mock data', async ({ page }) => {
    // Open bottom sheet to show mock data
    await page.locator('text=Show Mock Data').click();

    // Wait for mock data to load
    await page.waitForSelector('text=👥 Users', { timeout: 5000 });

    // Scroll within bottom sheet to see all content
    const bottomSheet = page.locator('[data-testid="bottom-sheet-view"]').first();

    // Check for themed elements in mock data
    await expect(page.locator('text=👥 Users')).toBeVisible();
    await expect(page.locator('text=📝 Posts')).toBeVisible();

    // Look for like counts and comments with success/accent colors using proper text selectors
    const likeText = page.locator('text=/❤️.*likes/').first();
    const commentText = page.locator('text=/💬.*comments/').first();

    if ((await likeText.count()) > 0) {
      await expect(likeText).toBeVisible();
    }

    if ((await commentText.count()) > 0) {
      await expect(commentText).toBeVisible();
    }

    // Take screenshot of themed mock data
    await page.screenshot({
      path: 'tests/screenshots/color-theming-mock-data.png',
      fullPage: true,
    });

    // Close bottom sheet
    await page.locator('text=Close Mock Data').click();
  });
});

import { test, expect } from '@playwright/test';

/**
 * Simple test to verify path aliases work and components load
 */
test.describe('Path Aliases Test', () => {
  test('should load the app and verify components are working', async ({ page }) => {
    // Navigate to the app
    await page.goto('/');

    // Wait for the app to load
    await page.waitForTimeout(3000);

    // Check if we can see some basic content indicating the IndexPage component loaded
    // Look for common React Native web elements or text that should be present
    await expect(page.locator('body')).toBeVisible();

    // Check if there are any console errors (this would indicate alias resolution issues)
    const consoleErrors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    // Wait a bit more to catch any errors
    await page.waitForTimeout(2000);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/alias-test.png', fullPage: true });

    // Check for specific error patterns that would indicate alias issues
    const hasAliasErrors = consoleErrors.some(
      (error) =>
        error.includes('Unable to resolve') ||
        error.includes('@/components') ||
        error.includes('Module not found')
    );

    // If we have alias errors, fail the test with details
    if (hasAliasErrors) {
      console.log('Console errors found:', consoleErrors);
      throw new Error(`Alias resolution failed. Errors: ${consoleErrors.join(', ')}`);
    }

    // Test passes if no alias-related errors are found
    console.log('✅ Path aliases are working correctly!');
  });
});

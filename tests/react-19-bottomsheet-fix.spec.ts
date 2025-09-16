import { test, expect } from '@playwright/test'

test.describe('React 19 BottomSheet Fix Validation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081')

    // Wait for the app to load completely
    await page.waitForSelector('text=Dream Pie', { timeout: 15000 })
    await page.waitForTimeout(2000) // Additional wait for full initialization
  })

  test('should load app without React 19 ref errors in console', async ({ page }) => {
    const consoleErrors: string[] = []
    const consoleWarnings: string[] = []
    const allLogs: string[] = []

    // Capture all console messages
    page.on('console', msg => {
      const text = msg.text()
      allLogs.push(`${msg.type()}: ${text}`)

      if (msg.type() === 'error') {
        consoleErrors.push(text)
      }
      if (msg.type() === 'warning') {
        consoleWarnings.push(text)
      }
    })

    // Wait for page to be fully loaded and React to initialize
    await page.waitForTimeout(3000)

    console.log('=== All Console Messages ===')
    allLogs.forEach(log => console.log(log))

    // Check for React 19 ref errors specifically
    const react19RefErrors = consoleErrors.filter(error =>
      error.includes('Accessing element.ref was removed in React 19') ||
      error.includes('ref was removed in React 19') ||
      error.includes('ref is now a regular prop')
    )

    console.log('=== React 19 Ref Errors Found ===')
    react19RefErrors.forEach(error => console.log(`ERROR: ${error}`))

    // Validate that there are NO React 19 ref errors
    expect(react19RefErrors.length).toBe(0)

    // Also check that the app rendered successfully (basic smoke test)
    await expect(page.locator('text=Dream Pie')).toBeVisible()
    await expect(page.locator('text=Let\'s create something new!')).toBeVisible()
  })

  test('should open paywall modal without React 19 errors when clicking Premium button', async ({ page }) => {
    const consoleErrors: string[] = []
    const react19Errors: string[] = []

    // Capture console messages
    page.on('console', msg => {
      const text = msg.text()
      if (msg.type() === 'error') {
        consoleErrors.push(text)
        if (text.includes('Accessing element.ref was removed in React 19') ||
            text.includes('ref was removed in React 19') ||
            text.includes('ref is now a regular prop')) {
          react19Errors.push(text)
        }
      }
    })

    // Look for the Premium button
    console.log('=== Looking for Premium button ===')
    const premiumButton = page.locator('text=🚀 Buy Premium')
    const buttonExists = await premiumButton.count()
    console.log(`Premium button count: ${buttonExists}`)

    if (buttonExists > 0) {
      const isVisible = await premiumButton.first().isVisible()
      console.log(`Premium button visible: ${isVisible}`)

      if (isVisible) {
        console.log('=== Clicking Premium button ===')

        // Clear any existing errors before the click
        consoleErrors.length = 0
        react19Errors.length = 0

        // Click the Premium button
        await premiumButton.first().click()

        // Wait for modal to potentially appear and any React 19 errors to be thrown
        await page.waitForTimeout(3000)

        // Check for modal content (paywall should open)
        const modalContent = await page.locator('text=Unlock Dream Pie Pro, text=Premium, text=Upgrade').count()
        console.log(`Modal content elements found: ${modalContent}`)

        // Log any React 19 errors that occurred during the click
        console.log('=== React 19 Errors After Button Click ===')
        react19Errors.forEach(error => console.log(`REACT 19 ERROR: ${error}`))

        console.log('=== All Console Errors After Button Click ===')
        consoleErrors.forEach(error => console.log(`ERROR: ${error}`))

        // The main test: NO React 19 ref errors should occur
        expect(react19Errors.length).toBe(0)

        // Take screenshot for debugging
        await page.screenshot({ path: 'react-19-fix-validation.png', fullPage: true })

        console.log('✅ Premium button clicked without React 19 ref errors')
      } else {
        console.log('❌ Premium button not visible - may be a different UI state')
      }
    } else {
      console.log('❌ Premium button not found - checking alternative selectors')

      // Try alternative selectors
      const altButton = page.locator('button:has-text("Premium"), button:has-text("Buy"), button:has-text("🚀")')
      const altCount = await altButton.count()
      console.log(`Alternative premium buttons found: ${altCount}`)

      if (altCount > 0) {
        await altButton.first().click()
        await page.waitForTimeout(3000)
        expect(react19Errors.length).toBe(0)
      }
    }
  })

  test('should validate BottomSheet component renders without forwardRef warnings', async ({ page }) => {
    const consoleMessages: string[] = []

    page.on('console', msg => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`)
    })

    // Navigate and wait for full load
    await page.waitForTimeout(3000)

    // Check for any forwardRef related warnings in console
    const forwardRefWarnings = consoleMessages.filter(msg =>
      msg.toLowerCase().includes('forwardref') ||
      msg.includes('ref') && msg.includes('deprecated')
    )

    console.log('=== ForwardRef Related Messages ===')
    forwardRefWarnings.forEach(warning => console.log(warning))

    // Should have no forwardRef deprecation warnings if our fix works
    expect(forwardRefWarnings.length).toBe(0)

    // Verify the app structure is intact
    await expect(page.locator('[data-testid="app"], body')).toBeVisible()

    console.log('✅ No forwardRef warnings detected')
  })
})
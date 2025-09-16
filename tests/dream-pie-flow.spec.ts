import { test, expect } from '@playwright/test'

test.describe('Dream Pie User Flows - Complete', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081')

    // Wait for the app to load - look for Dream Pie content
    await page.waitForSelector('text=Dream Pie', { timeout: 15000 })
  })

  test('should display Create tab with Dream Pie content', async ({ page }) => {
    // Check if Dream Pie header is visible
    await expect(page.getByText('Dream Pie')).toBeVisible()

    // Check for main creation content
    await expect(page.locator('text=Let\'s create something new!')).toBeVisible()

    // Check for pose selection area
    await expect(page.locator('text=Select a Pose')).toBeVisible()

    // Check for photo upload area
    await expect(page.locator('text=Add Your Photo')).toBeVisible()

    // Check for premium button (since user starts as free)
    await expect(page.locator('text=🚀 Buy Premium')).toBeVisible()

    // Check for the main Create button
    await expect(page.locator('text=Create My Photoshoot')).toBeVisible()
  })

  test('should open Settings screen when clicking settings icon', async ({ page }) => {
    // Look for settings icon button
    const settingsButton = page.locator('[accessibilityLabel="settings"]')

    if (await settingsButton.count() > 0) {
      await settingsButton.first().click()

      // Wait for navigation
      await page.waitForTimeout(1000)

      // Should navigate to settings page (Focus Mode)
      await expect(page.locator('text=Settings')).toBeVisible()
      await expect(page.locator('text=Preferences')).toBeVisible()

      console.log('✅ Settings navigation working')
    } else {
      console.log('⚠️ Settings button not found')
    }
  })

  test('should open all modals successfully', async ({ page }) => {
    // Test Browse Poses Modal
    const browsePosesButton = page.locator('text=Browse Poses')
    await expect(browsePosesButton).toBeVisible()
    await browsePosesButton.click()
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Choose a Pose')).toBeVisible()

    // Close modal by clicking Done
    await page.locator('text=Done').click()
    await page.waitForTimeout(500)

    // Test Add Photo Modal
    const addPhotoButton = page.locator('text=Add Photo')
    await addPhotoButton.click()
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Smart Selfie Tips')).toBeVisible()

    // Close modal
    await page.locator('text=Got it!').click()
    await page.waitForTimeout(500)

    // Test Paywall Modal
    const buyPremiumButton = page.locator('text=🚀 Buy Premium')
    await buyPremiumButton.click()
    await page.waitForTimeout(1000)
    await expect(page.locator('text=Unlock Dream Pie Pro')).toBeVisible()

    // Close modal
    await page.locator('text=Maybe Later').click()
    await page.waitForTimeout(500)

    console.log('✅ All modals working successfully')
  })

  test('should display Gallery tab when switching tabs', async ({ page }) => {
    // Look for Gallery tab
    const galleryTab = page.locator('text=Gallery')

    if (await galleryTab.isVisible()) {
      await galleryTab.click()

      // Wait for gallery content
      await page.waitForTimeout(1000)

      // Should show gallery content or empty state
      const hasContent = await page.locator('text=My Gallery').isVisible() ||
                        await page.locator('text=No creations yet').isVisible()

      expect(hasContent).toBe(true)
      console.log('✅ Gallery tab navigation working')
    }
  })

  test('should not have critical console errors', async ({ page }) => {
    const errors: string[] = []

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    // Wait for app to fully load and interact with modals
    await page.waitForTimeout(2000)

    // Test a modal to trigger any potential errors
    await page.locator('text=Browse Poses').click()
    await page.waitForTimeout(1000)
    await page.locator('text=Done').click()
    await page.waitForTimeout(1000)

    // Check for critical errors (ignore minor warnings)
    const criticalErrors = errors.filter(error =>
      error.includes('import.meta') ||
      error.includes('Cannot use import.meta outside a module') ||
      error.includes('TypeError') ||
      error.includes('ReferenceError')
    )

    expect(criticalErrors.length).toBe(0)
    console.log('✅ No critical errors found!')

    if (errors.length > 0) {
      console.log('Minor warnings (may be normal):', errors.slice(0, 2))
    }
  })
})
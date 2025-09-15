import { test, expect } from '@playwright/test'

test.describe('BottomSheet Demo Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the home page where the BottomSheet is displayed
    await page.goto('http://localhost:8081')

    // Wait for the page to load
    await page.waitForLoadState('networkidle')

    // Give extra time for React Native components to render
    await page.waitForTimeout(3000)
  })

  test('should display the main page with BottomSheet trigger button', async ({ page }) => {
    // Check if the page title contains app name or main content
    await expect(page.locator('text=Reanimated 4 + Bottom Sheet Demo')).toBeVisible()

    // Look for the "Show Mock Data" button
    const openButton = page.locator('text=Show Mock Data')
    await expect(openButton).toBeVisible()

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'tests/screenshots/page-loaded.png' })
  })

  test('should open BottomSheet when Open Bottom Sheet button is clicked', async ({ page }) => {
    // Wait for the Show Mock Data button to be visible
    const openButton = page.locator('text=Show Mock Data')
    await expect(openButton).toBeVisible({ timeout: 10000 })

    // Click the button to open BottomSheet
    await openButton.click()

    // Wait a moment for animation to complete
    await page.waitForTimeout(2000)

    // Check if BottomSheet content is now visible
    const bottomSheetTitle = page.locator('text=📱 Mock Data Demo')
    await expect(bottomSheetTitle).toBeVisible()

    // Check if BottomSheet description is visible
    const description = page.locator(
      'text=This is a React Native Bottom Sheet with gesture handling'
    )
    await expect(description).toBeVisible()

    // Take a screenshot showing the opened BottomSheet
    await page.screenshot({ path: 'tests/screenshots/bottomsheet-opened.png' })
  })

  test('should close BottomSheet when Close Mock Data button is clicked', async ({ page }) => {
    // First, open the BottomSheet
    const openButton = page.locator('text=Show Mock Data')
    await expect(openButton).toBeVisible({ timeout: 10000 })
    await openButton.click()

    // Wait for BottomSheet to open
    await page.waitForTimeout(2000)
    const bottomSheetTitle = page.locator('text=📱 Mock Data Demo')
    await expect(bottomSheetTitle).toBeVisible()

    // Now click the Close Mock Data button
    const closeButton = page.locator('text=Close Mock Data')
    await expect(closeButton).toBeVisible()
    await closeButton.click()

    // Wait for closing animation
    await page.waitForTimeout(2000)

    // Verify BottomSheet content is no longer visible
    await expect(bottomSheetTitle).not.toBeVisible()

    // Verify the Open Bottom Sheet button is still visible on main page
    await expect(openButton).toBeVisible()

    // Take a screenshot showing the closed state
    await page.screenshot({ path: 'tests/screenshots/bottomsheet-closed.png' })
  })

  test('should contain all expected BottomSheet information sections', async ({ page }) => {
    // Open the BottomSheet
    const openButton = page.locator('text=Show Mock Data')
    await expect(openButton).toBeVisible({ timeout: 10000 })
    await openButton.click()

    // Wait for BottomSheet to open
    await page.waitForTimeout(2000)

    // Check for Snap Points section
    const snapPointsHeader = page.locator('text=Snap Points')
    await expect(snapPointsHeader).toBeVisible()
    const snapPointsText = page.locator('text=25%, 50%, 90% of screen height')
    await expect(snapPointsText).toBeVisible()

    // Check for Gestures section
    const gesturesHeader = page.locator('text=Gestures')
    await expect(gesturesHeader).toBeVisible()
    const gesturesText = page.locator('text=Pan, swipe, and tap gestures supported')
    await expect(gesturesText).toBeVisible()

    // Check for Backdrop section
    const backdropHeader = page.locator('text=Backdrop')
    await expect(backdropHeader).toBeVisible()
    const backdropText = page.locator('text=Custom backdrop with opacity animation')
    await expect(backdropText).toBeVisible()

    // Take final screenshot showing all content
    await page.screenshot({ path: 'tests/screenshots/bottomsheet-content.png' })
  })

  test('complete BottomSheet workflow - open and close', async ({ page }) => {
    // Initial state - BottomSheet should be closed
    const bottomSheetTitle = page.locator('text=📱 Mock Data Demo')
    await expect(bottomSheetTitle).not.toBeVisible()

    // Open BottomSheet
    const openButton = page.locator('text=Show Mock Data')
    await expect(openButton).toBeVisible({ timeout: 10000 })
    await openButton.click()

    // Verify BottomSheet opened
    await page.waitForTimeout(2000)
    await expect(bottomSheetTitle).toBeVisible()

    // Close BottomSheet
    const closeButton = page.locator('text=Close Mock Data')
    await closeButton.click()

    // Verify BottomSheet closed
    await page.waitForTimeout(2000)
    await expect(bottomSheetTitle).not.toBeVisible()

    // Verify back to initial state
    await expect(openButton).toBeVisible()

    console.log('✅ BottomSheet workflow test passed - open and close functionality working!')
  })
})

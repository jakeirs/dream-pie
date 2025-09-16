import { test, expect } from '@playwright/test'

test.describe('Debug Paywall Modal Issue', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the app
    await page.goto('http://localhost:8081')

    // Wait for the app to load
    await page.waitForSelector('text=Dream Pie', { timeout: 15000 })
  })

  test('should debug Buy Premium button click and modal', async ({ page }) => {
    const errors: string[] = []
    const logs: string[] = []

    // Capture console messages
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
      logs.push(`${msg.type()}: ${msg.text()}`)
    })

    // Wait for page to be fully loaded
    await page.waitForTimeout(2000)

    console.log('=== Looking for Buy Premium button ===')

    // Check if button exists and is visible
    const buyPremiumButton = page.locator('text=🚀 Buy Premium')
    const buttonCount = await buyPremiumButton.count()
    console.log(`Found ${buttonCount} Buy Premium button(s)`)

    if (buttonCount > 0) {
      const isVisible = await buyPremiumButton.first().isVisible()
      console.log(`Button is visible: ${isVisible}`)

      if (isVisible) {
        console.log('=== Clicking Buy Premium button ===')

        // Try clicking the button
        try {
          await buyPremiumButton.first().click({ force: true })
          console.log('✅ Button clicked successfully')
        } catch (error) {
          console.log(`❌ Click failed: ${error}`)
        }

        // Wait for modal to potentially appear
        await page.waitForTimeout(3000)

        // Check for paywall modal content
        const paywallTitle = page.locator('text=Unlock Dream Pie Pro')
        const paywallVisible = await paywallTitle.isVisible()
        console.log(`Paywall modal visible: ${paywallVisible}`)

        // Check for any other modal indicators
        const modalElements = await page.locator('[role="dialog"], .modal, [data-testid*="modal"]').count()
        console.log(`Found ${modalElements} potential modal elements`)

        // Log any errors that occurred
        if (errors.length > 0) {
          console.log('=== Console Errors ===')
          errors.forEach(error => console.log(`ERROR: ${error}`))
        }

        // Log recent console messages
        console.log('=== Recent Console Messages ===')
        logs.slice(-5).forEach(log => console.log(log))

        // Take a screenshot for debugging
        await page.screenshot({ path: 'debug-paywall-after-click.png' })

      } else {
        console.log('❌ Buy Premium button is not visible')
      }
    } else {
      console.log('❌ Buy Premium button not found')
    }
  })
})
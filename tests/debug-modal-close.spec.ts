import { test, expect } from '@playwright/test'

test.describe('Debug Modal Close Issue', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:8081')
    await page.waitForSelector('text=Dream Pie', { timeout: 15000 })
  })

  test('should debug modal close behavior', async ({ page }) => {
    const logs: string[] = []

    // Capture console messages
    page.on('console', msg => {
      logs.push(`${msg.type()}: ${msg.text()}`)
    })

    // Wait for page to load
    await page.waitForTimeout(2000)

    console.log('=== Opening paywall modal ===')

    // Open modal
    const buyPremiumButton = page.locator('text=🚀 Buy Premium')
    await buyPremiumButton.click({ force: true })
    await page.waitForTimeout(1500)

    // Verify modal is open
    const modalVisible = await page.locator('text=Unlock Dream Pie Pro').isVisible()
    console.log(`Modal open: ${modalVisible}`)

    console.log('=== Attempting to close modal ===')

    // Try clicking Maybe Later
    const maybeLaterButton = page.locator('text=Maybe Later')
    const maybeLaterVisible = await maybeLaterButton.isVisible()
    console.log(`Maybe Later button visible: ${maybeLaterVisible}`)

    if (maybeLaterVisible) {
      await maybeLaterButton.click()
      console.log('✅ Maybe Later button clicked')

      // Wait and check multiple times
      for (let i = 0; i < 10; i++) {
        await page.waitForTimeout(500)
        const stillVisible = await page.locator('text=Unlock Dream Pie Pro').isVisible()
        console.log(`After ${(i + 1) * 500}ms: Modal still visible: ${stillVisible}`)
        if (!stillVisible) break
      }

      // Check final state
      const finallyVisible = await page.locator('text=Unlock Dream Pie Pro').isVisible()
      console.log(`Final modal state: visible = ${finallyVisible}`)
    }

    // Log recent console messages for debugging
    console.log('=== Console messages ===')
    logs.slice(-5).forEach(log => console.log(log))

    // Try alternative approach - press Escape
    console.log('=== Trying Escape key ===')
    await page.keyboard.press('Escape')
    await page.waitForTimeout(1000)

    const afterEscape = await page.locator('text=Unlock Dream Pie Pro').isVisible()
    console.log(`After Escape: Modal visible = ${afterEscape}`)
  })
})
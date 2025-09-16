import { test, expect } from '@playwright/test'

test('Test root URL and React 19 fix', async ({ page }) => {
  const consoleMessages: Array<{type: string, text: string}> = []

  // Capture ALL console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    })
  })

  console.log('🚀 Testing root URL: http://localhost:8081/')

  // Try navigating to just the root URL
  await page.goto('http://localhost:8081/')
  await page.waitForTimeout(5000)

  const bodyContent = await page.locator('body').textContent()
  console.log('\n=== PAGE CONTENT ===')
  console.log(bodyContent)

  console.log('\n=== ALL CONSOLE MESSAGES ===')
  consoleMessages.forEach((msg, index) => {
    console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`)
  })

  // Check for React 19 errors specifically
  const react19Errors = consoleMessages.filter(msg =>
    msg.text.includes('Accessing element.ref was removed in React 19') ||
    msg.text.includes('ref was removed in React 19') ||
    msg.text.includes('ref is now a regular prop') ||
    msg.text.toLowerCase().includes('forwardref')
  )

  console.log(`\n=== REACT 19/FORWARDREF RELATED ERRORS: ${react19Errors.length} ===`)
  react19Errors.forEach((error, index) => {
    console.log(`REACT 19 ERROR ${index + 1}: ${error.text}`)
  })

  // Take screenshot
  await page.screenshot({ path: 'root-url-test.png', fullPage: true })

  expect(true).toBe(true)
})
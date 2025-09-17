import { test, expect } from '@playwright/test'

test('Debug app crash and capture console errors', async ({ page }) => {
  const consoleMessages: {type: string, text: string}[] = []

  // Capture ALL console messages
  page.on('console', msg => {
    consoleMessages.push({
      type: msg.type(),
      text: msg.text()
    })
  })

  // Navigate to the app
  console.log('🚀 Navigating to http://localhost:8081')
  await page.goto('http://localhost:8081')

  // Wait for page to load and capture errors
  await page.waitForTimeout(5000)

  console.log('\n=== ALL CONSOLE MESSAGES ===')
  consoleMessages.forEach((msg, index) => {
    console.log(`${index + 1}. [${msg.type.toUpperCase()}] ${msg.text}`)
  })

  // Filter errors specifically
  const errors = consoleMessages.filter(msg => msg.type === 'error')
  console.log(`\n=== ERRORS FOUND: ${errors.length} ===`)
  errors.forEach((error, index) => {
    console.log(`ERROR ${index + 1}: ${error.text}`)
  })

  // Filter React 19 specific errors
  const react19Errors = consoleMessages.filter(msg =>
    msg.text.includes('Accessing element.ref was removed in React 19') ||
    msg.text.includes('ref was removed in React 19') ||
    msg.text.includes('ref is now a regular prop')
  )
  console.log(`\n=== REACT 19 REF ERRORS: ${react19Errors.length} ===`)
  react19Errors.forEach((error, index) => {
    console.log(`REACT 19 ERROR ${index + 1}: ${error.text}`)
  })

  // Check if page has any content at all
  const bodyContent = await page.locator('body').textContent()
  console.log(`\n=== PAGE BODY CONTENT (first 200 chars) ===`)
  console.log(bodyContent?.slice(0, 200) || 'NO CONTENT')

  // Take screenshot
  await page.screenshot({ path: 'app-crash-debug.png', fullPage: true })
  console.log('\n📸 Screenshot saved as app-crash-debug.png')

  // The test always passes - we're just debugging
  expect(true).toBe(true)
})
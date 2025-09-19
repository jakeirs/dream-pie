/**
 * GEMINI API TYPES - AI Integration
 *
 * WHEN CREATED: When user initiates Gemini chat interaction
 * WHERE CREATED: Login page button press, API route processing
 *
 * WHEN USED: During AI conversation flow
 * WHERE USED: components/PAGE/login/index.tsx, app/api/gemini+api.ts
 *
 * HOW DATA EVOLVES:
 * - CREATE: User clicks "Message to Gemini" button
 * - READ: Display AI response in UI
 * - UPDATE: N/A (stateless API calls)
 * - DELETE: N/A (no persistence)
 *
 * RELATIONSHIPS: Independent AI service integration
 */

export interface GeminiRequest {
  message: string
}

export interface GeminiResponse {
  text: string
  error?: string
}

export interface GeminiState {
  response: string | null
  isLoading: boolean
  error: string | null
}
/**
 * FAL AI API TYPES - Image Editing Integration
 *
 * WHEN CREATED: When user initiates FAL AI image editing interaction
 * WHERE CREATED: Test API page button press, API route processing
 *
 * WHEN USED: During AI image editing flow
 * WHERE USED: components/PAGE/test-api/index.tsx, app/api/fal+api.ts
 *
 * HOW DATA EVOLVES:
 * - CREATE: User clicks "Generate Photo" button with image and prompt
 * - READ: Display edited image and description in UI
 * - UPDATE: N/A (stateless API calls)
 * - DELETE: N/A (no persistence)
 *
 * RELATIONSHIPS: Independent AI service integration for image editing
 */

export interface FalRequest {
  prompt: string
  imageData: string // base64 encoded image data
}

export interface FalResponse {
  imageUrl: string
  description: string
  error?: string
}

export interface FalState {
  response: FalResponse | null
  isLoading: boolean
  error: string | null
}
import { ValidationError, ValidationErrorInfo } from '@fal-ai/client'

// Re-export for convenience
export { ValidationError, ValidationErrorInfo }
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
  imageData: string // Image URL (not base64, FAL expects URLs)
}

// Raw FAL API Response Structure (for documentation and reference)
export interface FalImageData {
  url: string
  content_type: string
  file_name: string
  file_size: number | null
}

export interface FalRawResponse {
  data: {
    images: FalImageData[]
    description: string
  }
  requestId: string
}

// Our Simplified API Response (what our backend actually returns)
export interface FalResponse {
  imageUrl: string
  description: string
  requestId: string        // NEW: Track request ID from FAL
  contentType: string      // NEW: Image content type (jpeg, png, etc.)
  fileName: string         // NEW: Generated filename
  error?: string
}

// Import official FAL types from library

export interface FalState {
  response: FalResponse | null
  isLoading: boolean
  error: string | null
}
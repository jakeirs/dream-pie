/**
 * GEMINI API TYPES - AI Integration
 *
 * WHEN CREATED: When user initiates Gemini chat interaction or pose analysis
 * WHERE CREATED: Login page button press, pose analysis button press, API route processing
 *
 * WHEN USED: During AI conversation flow and pose photo analysis
 * WHERE USED: components/PAGE/login/index.tsx, components/PAGE/index/components/Bottom/PoseAnalyzer, app/api/gemini+api.ts
 *
 * HOW DATA EVOLVES:
 * - CREATE: User clicks "Message to Gemini" or "Analyze Pose Photo" button
 * - READ: Display AI response in UI or Alert component
 * - UPDATE: N/A (stateless API calls)
 * - DELETE: N/A (no persistence)
 *
 * RELATIONSHIPS: Independent AI service integration, connects to Zustand pose store for image analysis
 */

export interface GeminiRequest {
  message: string
}

export interface GeminiImageAnalysisRequest {
  prompt: string
  imageBase64: string
  mimeType: string
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
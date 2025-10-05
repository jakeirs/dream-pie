import { ImageMimeType } from '@/shared/types/image'

/**
 * GENERATE PHOTO SERVICE TYPES
 *
 * Service-specific types for photo generation with validation flow.
 * Separate from global types to maintain clean service boundaries.
 */

/**
 * Input parameters for photo generation with validation
 */
export interface GeneratePhotoParams {
  collageImage: string // Base64 or URL of collage image (selfie + pose combined)
  selfieImage?: string // Optional: Base64 or URL of selfie for person comparison
  poseImage: string // Base64 or URL of pose image for fallback description
  prompt: string // Generation prompt for FAL AI
  abortSignal?: AbortSignal // Optional: Cancellation support
}

/**
 * Validation result from Gemini checks
 */
export interface ValidationResult {
  passed: boolean // Overall validation passed (not collage AND same person)
  isCollage: boolean // True if generated image is a collage
  isSamePerson: boolean // True if generated image matches selfie
  confidence: number // Likelihood score (0-1) from person comparison
  details?: string // Additional details or error messages
}

/**
 * Collage check result from Gemini
 */
export interface CollageCheckResult {
  isCollage: boolean
  details?: string
}

/**
 * Person comparison result from Gemini
 */
export interface PersonComparisonResult {
  isSamePerson: boolean
  confidence: number // Likelihood score (0-1)
  details?: string
}

/**
 * Final result returned to caller
 */
export interface GeneratePhotoResult {
  photo: string // Final generated photo (base64 or URL)
  confidence?: number // Person match confidence (if validation was performed)
  wasRegenerated?: boolean // True if fallback regeneration was used
  validationDetails?: ValidationResult // Full validation details
  error?: string // Error message if generation failed
}

/**
 * FAL provider generation parameters
 */
export interface FalGenerateParams {
  imageData: string // Base64 or URL
  prompt: string
  abortSignal?: AbortSignal
}

/**
 * FAL provider generation result
 */
export interface FalGenerateResult {
  imageUrl: string
  description?: string
  requestId?: string
}

/**
 * Gemini provider analysis parameters
 */
export interface GeminiAnalysisParams {
  prompt: string
  imageBase64: string
  mediaType: ImageMimeType // AI SDK uses mediaType (not mimeType)
  abortSignal?: AbortSignal
}

/**
 * Gemini provider analysis result
 */
export interface GeminiAnalysisResult {
  text: string
  parsed?: any // Parsed JSON response (for structured outputs)
}

/**
 * Validation parameters
 */
export interface ValidationParams {
  generatedPhoto: string
  selfieImage: string
  abortSignal?: AbortSignal
}

/**
 * Fallback regeneration parameters
 */
export interface FallbackParams {
  poseImage: string
  selfieImage: string
  abortSignal?: AbortSignal
}

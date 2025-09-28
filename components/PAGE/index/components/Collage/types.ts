/**
 * COLLAGE TYPES
 *
 * TypeScript interfaces for collage generation feature
 * Used for image composition, canvas rendering, and sharing functionality
 */

export interface CollageConfig {
  canvasWidth: number
  canvasHeight: number
  backgroundColorHex: string
  imagePadding: number
  imageAreaSize: number
}

export interface CollageGenerationState {
  isGenerating: boolean
  isReady: boolean
  error: string | null
  collageImageUri: string | null
}

export interface CollagePosition {
  x: number
  y: number
  width: number
  height: number
}

export interface ShareResult {
  success: boolean
  error?: string
}
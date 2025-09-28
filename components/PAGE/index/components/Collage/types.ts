/**
 * COLLAGE TYPES
 *
 * TypeScript interfaces for collage generation feature
 * Used for image composition, canvas rendering, and sharing functionality
 */

export type ImageFormat = 'png' | 'webp' | 'jpeg'

export type BackgroundMode = 'solid' | 'transparent'

export interface CollageConfig {
  canvasWidth: number
  canvasHeight: number
  backgroundColorHex: string
  backgroundMode: BackgroundMode
  imagePadding: number
  imageAreaSize: number
  outputFormat: ImageFormat
  quality: number // 0-100, used for WebP encoding
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

export interface DualImageLayout {
  referencePhoto: CollagePosition // Top right, 70% size
  selfiePhoto: CollagePosition     // Top left, remaining space
}

export interface ShareResult {
  success: boolean
  error?: string
}

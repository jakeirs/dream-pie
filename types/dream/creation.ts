/**
 * DREAM PIE TYPES - Creations
 *
 * Defines the structure for AI-generated creation results
 * Used for generation process, results display, and gallery
 */

export interface Creation {
  id: string
  userId: string
  originalPhoto: string // User's selfie
  selectedPose: {
    id: string
    name: string
    category: string
  }
  resultImage: string // AI generated result
  status: CreationStatus
  generatedAt: string
  processingTime?: number // in seconds
}

export type CreationStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'failed'

export interface GenerationProgress {
  currentStep: GenerationStep
  progress: number // 0-100
  estimatedTimeRemaining: number // in seconds
  message: string
}

export type GenerationStep =
  | 'analyzing-photo'
  | 'processing-pose'
  | 'generating-image'
  | 'finalizing'
  | 'complete'

export interface ShareOptions {
  platform: 'instagram' | 'tiktok' | 'twitter' | 'facebook' | 'more'
  includeBeforeAfter: boolean
  addWatermark: boolean
}
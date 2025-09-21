/**
 * DREAM PIE TYPES - Creations
 *
 * Defines the structure for AI-generated creation results
 * Used for generation process, results display, and gallery
 */

import { Pose } from './pose'
import { Selfie } from './selfie'

export interface Creation {
  id: string
  usedPose: Pose
  usedSelfie: Selfie
  imageUrl: string // AI generated result
  generatedAt: string
}
/**
 * Type guards for identifying gallery content types
 */

import { Creation, Pose, Selfie, GalleryContent } from '@/types'

/**
 * Type guard to check if item is a Creation
 * Creation has: usedPose, usedSelfie, imageUrl, generatedAt
 */
export const isCreation = (item: GalleryContent): item is Creation => {
  return 'usedPose' in item && 'usedSelfie' in item && 'imageUrl' in item && 'generatedAt' in item
}

/**
 * Type guard to check if item is a Pose
 * Pose has: category, isPremium
 */
export const isPose = (item: GalleryContent): item is Pose => {
  return 'category' in item
}

/**
 * Type guard to check if item is a Selfie
 * Selfie has: imageUrl but NOT usedPose/usedSelfie (distinguishes from Creation)
 */
export const isSelfie = (item: GalleryContent): item is Selfie => {
  return (
    'imageUrl' in item && !('usedPose' in item) && !('usedSelfie' in item) && !('category' in item)
  )
}

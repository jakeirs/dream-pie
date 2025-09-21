/**
 * DREAM PIE TYPES - Poses
 *
 * Defines the structure for pose data in the Dream Pie app
 * Used for pose selection, library, and AI generation
 */

export interface Pose {
  id: string
  name: string
  description: string
  category: PoseCategory
  imageUrl: string // Will now be a simple string path
  isPremium: boolean
  tags: string[]
  createdAt: string
  posePrompt?: string // Optional reference to prompt ID
}

export type PoseCategory =
  | 'professional'
  | 'casual'
  | 'travel'
  | 'fashion'
  | 'fitness'
  | 'creative'

export interface PoseCategoryInfo {
  id: PoseCategory
  name: string
  description: string
  icon: string
  color: string
}

export interface SelectedPose {
  pose: Pose
  selectedAt: string
}
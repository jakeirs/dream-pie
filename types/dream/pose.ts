/**
 * DREAM PIE TYPES - Poses
 *
 * Defines the structure for pose data in the Dream Pie app
 * Used for pose selection, library, and AI generation
 */

export interface ImageUrl {
  height: number
  width: number
  uri: string
}

export interface Pose {
  id: string
  name: string
  description: string
  category: PoseCategory
  imageUrl: string | number | ImageUrl // Support URL strings, require() numbers, and complex image objects
  isPremium: boolean
  tags: string[]
  createdAt: string
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
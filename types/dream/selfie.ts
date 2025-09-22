/**
 * DREAM PIE TYPES - Selfies
 *
 * Defines the structure for selfie data in the Dream Pie app
 * Used for selfie selection, selfie library, and AI generation input
 */

export interface Selfie {
  id: string
  name: string
  description: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

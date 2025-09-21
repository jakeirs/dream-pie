/**
 * DREAM PIE TYPES - Gallery
 *
 * Defines the structure for gallery functionality
 * Used for gallery display, filtering, and content management
 */

import { Creation } from './creation'
import { Pose } from './pose'
import { Selfie } from './selfie'

export type FilterType = 'creations' | 'poses' | 'selfies'

export type GalleryContent = Creation | Pose | Selfie

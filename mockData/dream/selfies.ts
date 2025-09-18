/**
 * MOCK DATA LIFECYCLE - Selfies
 *
 * WHEN CREATED: App initialization, selfie library loading, user upload simulation
 * WHERE CREATED: SelfieService.loadSelfies(), selfie chooser components
 *
 * WHEN USED: Selfie selection, selfie library browsing, creation flow input
 * WHERE USED: CreatePage, SelfieChooserBottomSheet, SelfieCard components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New selfies added by user uploads or example library
 * - READ: Selfie browsing, selection for AI generation
 * - UPDATE: Metadata updates, tagging improvements
 * - DELETE: User removes personal selfies
 *
 * RELATIONSHIPS:
 * - Creations: selfies.id -> creations.inputSelfie.id (one-to-many)
 * - Generations: Selected selfie used as input for AI pose generation
 */

import { Selfie } from '@/types/dream/selfie'
import { appAssets } from '@/shared/assets/assets'

export const mockSelfies: Selfie[] = [
  {
    id: 'selfie_1',
    name: 'Extended Arm Selfie',
    description: 'Classic selfie with extended arm position',
    imageUrl: appAssets.selfies.extendPhoto,
    tags: ['extended-arm', 'casual', 'selfie', 'example'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'selfie_2',
    name: 'Front Facing Portrait',
    description: 'Direct front-facing selfie for AI processing',
    imageUrl: appAssets.selfies.extendPhoto, // Using same asset for demo
    tags: ['front-facing', 'portrait', 'clear', 'example'],
    createdAt: '2024-01-16T14:22:00Z',
  },
  {
    id: 'selfie_3',
    name: 'Natural Lighting Selfie',
    description: 'Well-lit selfie with natural lighting conditions',
    imageUrl: appAssets.selfies.extendPhoto, // Using same asset for demo
    tags: ['natural-light', 'outdoor', 'clear', 'example'],
    createdAt: '2024-01-17T09:15:00Z',
  },
]

export const getSelfieById = (id: string): Selfie | undefined => {
  return mockSelfies.find((selfie) => selfie.id === id)
}

export const getSelfiesByTag = (tag: string): Selfie[] => {
  return mockSelfies.filter((selfie) => selfie.tags.includes(tag))
}
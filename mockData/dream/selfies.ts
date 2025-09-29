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
    id: 'selfie_12',
    name: 'Extended Arm Selfie Siema',
    description: 'Classic selfie with extended arm position',
    imageUrl: appAssets.selfies.extendPhoto,
    tags: ['extended-arm', 'casual', 'selfie', 'example'],
    createdAt: '2024-01-15T10:30:00Z',
  },
]

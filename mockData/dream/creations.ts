/**
 * MOCK DATA LIFECYCLE - Dream Pie Creations
 *
 * WHEN CREATED: User completes AI generation, result processing
 * WHERE CREATED: CreationStore.addCreation(), photoGenerationStore success
 *
 * WHEN USED: Gallery display, result viewing, sharing functionality
 * WHERE USED: GalleryPage, ResultPage, creation browsing components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New creations from AI generation completion
 * - READ: Gallery browsing, result viewing, sharing
 * - UPDATE: Metadata changes, sharing status updates
 * - DELETE: User removes creations from gallery
 *
 * RELATIONSHIPS:
 * - Poses: creations.usedPose -> poses (embedded object)
 * - Selfies: creations.usedSelfie -> selfies (embedded object)
 * - Gallery: Direct relationship with user's saved creations
 */

import { Creation } from '@/types/dream'
import { mockPoses } from './poses'
import { mockSelfies } from './selfies'
import { appAssets } from '@/shared/assets/assets'

export const mockCreations: Creation[] = [
  {
    id: 'creation_1',
    usedPose: mockPoses[0], // Professional Portrait
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.img,
    generatedAt: '2024-01-10T14:22:00Z',
  },
  {
    id: 'creation_2',
    usedPose: mockPoses[1], // Elegant Dress
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.jsonInstruction,
    generatedAt: '2024-01-09T16:30:00Z',
  },
  {
    id: 'creation_3',
    usedPose: mockPoses[0], // Professional Portrait
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.img,
    generatedAt: '2024-01-08T11:15:00Z',
  },
  {
    id: 'creation_4',
    usedPose: mockPoses[1], // Elegant Dress
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.jsonInstruction,
    generatedAt: '2024-01-07T16:45:00Z',
  },
  {
    id: 'creation_5',
    usedPose: mockPoses[0], // Professional Portrait
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.img,
    generatedAt: '2024-01-06T13:30:00Z',
  },
  {
    id: 'creation_6',
    usedPose: mockPoses[1], // Elegant Dress
    usedSelfie: mockSelfies[0], // Extended Arm Selfie
    imageUrl: appAssets.gallery.jsonInstruction,
    generatedAt: '2024-01-05T10:15:00Z',
  },
]

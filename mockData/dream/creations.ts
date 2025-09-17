/**
 * MOCK DATA LIFECYCLE - Dream Pie Creations
 *
 * WHEN CREATED: User completes AI generation, result processing
 * WHERE CREATED: GenerationService.completeGeneration(), result processing
 *
 * WHEN USED: Gallery display, result viewing, sharing functionality
 * WHERE USED: GalleryPage, ResultPage, ShareBottomSheet components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New creations from AI generation completion
 * - READ: Gallery browsing, result viewing, sharing
 * - UPDATE: Metadata changes, sharing status updates
 * - DELETE: User removes creations from gallery
 *
 * RELATIONSHIPS:
 * - Users: creations.userId -> users.id (many-to-one)
 * - Poses: creations.selectedPose.id -> poses.id (many-to-one)
 * - Gallery: Direct relationship with user's saved creations
 */

import { Creation, CreationStatus } from '@/types/dream'
import { mockSubscriptionPlans } from './subscriptions'
import { appAssets } from '@/shared/assets/assets'

export const mockCreations: Creation[] = [
  {
    id: 'creation_1',
    userId: 'user_1',
    originalPhoto: appAssets.selfies.extendPhoto,
    selectedPose: {
      id: 'pose_1',
      name: 'Professional Portrait',
      category: 'professional',
    },
    resultImage: appAssets.gallery.img,
    status: 'completed',
    generatedAt: '2024-01-10T14:22:00Z',
    processingTime: 45,
  },
  {
    id: 'creation_2',
    userId: 'user_1',
    originalPhoto: appAssets.selfies.extendPhoto,
    selectedPose: {
      id: 'pose_2',
      name: 'Elegant Dress',
      category: 'fashion',
    },
    resultImage: appAssets.gallery.jsonInstruction,
    status: 'completed',
    generatedAt: '2024-01-09T16:30:00Z',
    processingTime: 52,
  },
  {
    id: 'creation_3',
    userId: 'user_1',
    originalPhoto: appAssets.selfies.extendPhoto,
    selectedPose: {
      id: 'pose_3',
      name: 'Casual Confidence',
      category: 'casual',
    },
    resultImage: appAssets.gallery.img,
    status: 'completed',
    generatedAt: '2024-01-08T11:15:00Z',
    processingTime: 38,
  },
  {
    id: 'creation_4',
    userId: 'user_1',
    originalPhoto: appAssets.selfies.extendPhoto,
    selectedPose: {
      id: 'pose_4',
      name: 'Travel Ready',
      category: 'travel',
    },
    resultImage: appAssets.gallery.jsonInstruction,
    status: 'processing',
    generatedAt: '2024-01-11T09:45:00Z',
    processingTime: undefined, // Still processing
  },
]

// Note: mockSubscriptionPlans is defined in subscriptions.ts to avoid duplicate exports

// Helper functions
export const getCreationById = (id: string): Creation | undefined => {
  return mockCreations.find(creation => creation.id === id)
}

export const getCreationsByUserId = (userId: string): Creation[] => {
  return mockCreations.filter(creation => creation.userId === userId)
}

export const getCompletedCreations = (userId: string): Creation[] => {
  return mockCreations.filter(
    creation => creation.userId === userId && creation.status === 'completed'
  )
}

export const getCreationsByCategory = (userId: string, category: string): Creation[] => {
  return mockCreations.filter(
    creation =>
      creation.userId === userId &&
      creation.selectedPose.category === category &&
      creation.status === 'completed'
  )
}

// Mock user data for Dream Pie
export const mockDreamPieUser = {
  id: 'user_1',
  username: 'dream_creator',
  email: 'creator@dreampie.com',
  avatar: appAssets.selfies.extendPhoto,
  subscription: {
    tier: 'free' as const,
    status: 'active' as const,
    creditsRemaining: 2,
    creditsTotal: 3,
    features: mockSubscriptionPlans[0].features,
  },
  preferences: {
    defaultPoseCategory: 'professional',
    autoSaveResults: true,
    shareWithWatermark: false,
    allowNotifications: true,
    preferredQuality: 'high' as const,
  },
  onboarding: {
    completed: true,
    currentStep: 'subscription-intro' as const,
    completedSteps: ['welcome', 'camera-permission', 'first-pose-selection'] as const,
    startedAt: '2024-01-05T10:00:00Z',
    completedAt: '2024-01-05T10:15:00Z',
  },
  stats: {
    totalGenerations: 3,
    favoriteCategory: 'professional',
    joinedAt: '2024-01-05T10:00:00Z',
    lastActiveAt: '2024-01-11T14:30:00Z',
    creationsThisMonth: 3,
  },
}
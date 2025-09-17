/**
 * MOCK DATA LIFECYCLE - Dream Pie Poses
 *
 * WHEN CREATED: App initialization, pose library loading
 * WHERE CREATED: PoseService.loadPoses(), pose library components
 *
 * WHEN USED: Pose selection, pose library browsing, creation flow
 * WHERE USED: CreatePage, PoseLibraryBottomSheet, PoseCard components
 *
 * HOW DATA EVOLVES:
 * - CREATE: New poses added by content team
 * - READ: Pose browsing, category filtering, selection
 * - UPDATE: Premium status changes, metadata updates
 * - DELETE: Deprecated poses removal
 *
 * RELATIONSHIPS:
 * - Creations: poses.id -> creations.selectedPose.id (many-to-many)
 * - Subscriptions: poses.isPremium -> subscription.features.premiumPoses (access control)
 */

import { Pose, PoseCategory, PoseCategoryInfo } from '@/types/dream'
import { appAssets } from '@/shared/assets/assets'

export const mockPoses: Pose[] = [
  {
    id: 'pose_1',
    name: 'Professional Portrait',
    description: 'Clean, confident professional headshot pose',
    category: 'professional',
    imageUrl: appAssets.poses.fromTop,
    isPremium: false,
    tags: ['business', 'headshot', 'confident', 'clean'],
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'pose_2',
    name: 'Elegant Dress',
    description: 'Sophisticated dress pose with graceful posture',
    category: 'fashion',
    imageUrl: appAssets.poses.dress,
    isPremium: true,
    tags: ['elegant', 'fashion', 'dress', 'sophisticated'],
    createdAt: '2024-01-20T14:22:00Z',
  },
  {
    id: 'pose_3',
    name: 'Casual Confidence',
    description: 'Relaxed yet confident casual pose',
    category: 'casual',
    imageUrl: appAssets.poses.fromTop,
    isPremium: false,
    tags: ['casual', 'relaxed', 'friendly', 'approachable'],
    createdAt: '2024-01-18T16:45:00Z',
  },
  {
    id: 'pose_4',
    name: 'Travel Ready',
    description: 'Adventure-ready pose perfect for travel photos',
    category: 'travel',
    imageUrl: appAssets.poses.dress,
    isPremium: true,
    tags: ['adventure', 'travel', 'outdoors', 'explorer'],
    createdAt: '2024-01-25T09:20:00Z',
  },
  {
    id: 'pose_5',
    name: 'Creative Expression',
    description: 'Artistic and creative pose for unique shots',
    category: 'creative',
    imageUrl: appAssets.poses.fromTop,
    isPremium: true,
    tags: ['artistic', 'creative', 'unique', 'expressive'],
    createdAt: '2024-01-22T11:15:00Z',
  },
  {
    id: 'pose_6',
    name: 'Fitness Power',
    description: 'Strong, athletic pose showcasing fitness',
    category: 'fitness',
    imageUrl: appAssets.poses.dress,
    isPremium: false,
    tags: ['fitness', 'strong', 'athletic', 'healthy'],
    createdAt: '2024-01-28T08:30:00Z',
  },
]

export const mockPoseCategories: PoseCategoryInfo[] = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Business and career-focused poses',
    icon: 'briefcase',
    color: '#007AFF',
  },
  {
    id: 'casual',
    name: 'Casual',
    description: 'Relaxed everyday poses',
    icon: 'coffee',
    color: '#34C759',
  },
  {
    id: 'travel',
    name: 'Travel',
    description: 'Adventure and exploration poses',
    icon: 'map',
    color: '#FF9500',
  },
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Stylish and trendy poses',
    icon: 'star',
    color: '#FF453A',
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Active and athletic poses',
    icon: 'activity',
    color: '#32D74B',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Artistic and expressive poses',
    icon: 'palette',
    color: '#AF52DE',
  },
]

// Helper functions
export const getPoseById = (id: string): Pose | undefined => {
  return mockPoses.find(pose => pose.id === id)
}

export const getPosesByCategory = (category: PoseCategory): Pose[] => {
  return mockPoses.filter(pose => pose.category === category)
}

export const getFreePoses = (): Pose[] => {
  return mockPoses.filter(pose => !pose.isPremium)
}

export const getPremiumPoses = (): Pose[] => {
  return mockPoses.filter(pose => pose.isPremium)
}

export const getCategoryInfo = (category: PoseCategory): PoseCategoryInfo | undefined => {
  return mockPoseCategories.find(cat => cat.id === category)
}

// Featured/recommended poses for onboarding
export const getFeaturedPoses = (): Pose[] => {
  return [mockPoses[0], mockPoses[2], mockPoses[5]] // Mix of free poses
}
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

import { Pose } from '@/types/dream'
import { appAssets } from '@/shared/assets/assets'

export const mockPosesNew: Pose[] = [
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
    id: 'pose_2',
    name: 'Selfie',
    description: 'Selfie pose with extended arm',
    category: 'fashion',
    imageUrl: appAssets.selfies.extendPhoto,
    isPremium: true,
    tags: ['elegant', 'fashion', 'dress', 'sophisticated'],
    createdAt: '2024-01-20T14:22:00Z',
  },
]

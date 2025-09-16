/**
 * ZUSTAND STORE LIFECYCLE - Pose Store
 *
 * STATE PURPOSE: Manages pose selection, library browsing, and category filtering
 * WHEN CREATED: App launch, pose library access
 * WHERE CREATED: PoseLibrary components, CreatePage initialization
 *
 * WHEN UPDATED: Pose selection, category changes, library browsing
 * WHERE UPDATED: PoseLibrary, CreatePage, PoseCard interactions
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Load pose library, set default category
 * - READ: Browse poses, filter by category, check selection
 * - UPDATE: Select pose, change category, refresh library
 * - PERSIST: Last selected pose (optional)
 * - RESET: Clear selection on new session
 *
 * RELATIONSHIPS:
 * - Connected to subscriptionStore for premium pose access
 * - Used by generationStore for creation input
 * - Filtered by premium status based on user subscription
 * SIDE EFFECTS: Pose selection changes, category filter updates
 */

import { create } from 'zustand'
import { Pose, PoseCategory, PoseCategoryInfo } from '@/types/dream'
import {
  mockPoses,
  mockPoseCategories,
  getPosesByCategory,
  getFreePoses,
  getPremiumPoses,
  getFeaturedPoses
} from '@/mockData/dream'

interface PoseState {
  // Pose data
  poses: Pose[]
  poseCategories: PoseCategoryInfo[]
  selectedPose: Pose | null

  // Filtering
  selectedCategory: PoseCategory | 'all'
  filteredPoses: Pose[]

  // Loading states
  isLoading: boolean
  error: string | null

  // Actions
  loadPoses: () => Promise<void>
  selectPose: (pose: Pose) => void
  clearSelectedPose: () => void
  setCategory: (category: PoseCategory | 'all') => void

  // Filtering helpers
  filterPosesByCategory: (category: PoseCategory | 'all') => void
  filterPosesByPremiumStatus: (showPremium: boolean) => void

  // Getters
  getFeaturedPoses: () => Pose[]
  getFreePoses: () => Pose[]
  getPremiumPoses: () => Pose[]
}

export const usePoseStore = create<PoseState>((set, get) => ({
  poses: mockPoses,
  poseCategories: mockPoseCategories,
  selectedPose: null,

  selectedCategory: 'all',
  filteredPoses: mockPoses,

  isLoading: false,
  error: null,

  loadPoses: async () => {
    set({ isLoading: true, error: null })

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // In a real app, this would be an API call
      const poses = mockPoses
      const categories = mockPoseCategories

      set({
        poses,
        poseCategories: categories,
        filteredPoses: poses,
        isLoading: false
      })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to load poses',
        isLoading: false
      })
    }
  },

  selectPose: (pose) => set({ selectedPose: pose }),

  clearSelectedPose: () => set({ selectedPose: null }),

  setCategory: (category) => {
    set({ selectedCategory: category })
    get().filterPosesByCategory(category)
  },

  filterPosesByCategory: (category) => {
    const { poses } = get()

    const filtered = category === 'all'
      ? poses
      : poses.filter(pose => pose.category === category)

    set({ filteredPoses: filtered })
  },

  filterPosesByPremiumStatus: (showPremium) => {
    const { poses, selectedCategory } = get()

    let filtered = selectedCategory === 'all'
      ? poses
      : poses.filter(pose => pose.category === selectedCategory)

    if (!showPremium) {
      filtered = filtered.filter(pose => !pose.isPremium)
    }

    set({ filteredPoses: filtered })
  },

  getFeaturedPoses: () => getFeaturedPoses(),

  getFreePoses: () => getFreePoses(),

  getPremiumPoses: () => getPremiumPoses()
}))
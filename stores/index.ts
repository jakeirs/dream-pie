// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'
import { usePoseStore } from './poseStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation, pose } = useAppStores()
 * pose.setSelectedPose(selectedPose)
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
  pose: usePoseStore(),
})

// Export individual stores for direct access and inline selectors
export { useNavigationStore } from './navigationStore'
export { usePoseStore } from './poseStore'

// Re-export useStore from zustand for inline selectors
export { useStore } from 'zustand'
// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'
import { usePoseStore } from './poseStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation, pose } = useAppStores()
 * pose.setPoses(mockPoses)
 * pose.setSelectedPose(selectedPose)
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
  pose: usePoseStore(),
})

// Export individual stores for direct access if needed
export { useNavigationStore } from './navigationStore'
export { usePoseStore } from './poseStore'
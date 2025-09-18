// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'
import { usePoseStore } from './poseStore'
import { useSelfieChooserStore } from './selfieChooserStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation, pose, selfieChooser } = useAppStores()
 * selfieChooser.setSelectedSelfie(selectedSelfie)
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
  pose: usePoseStore(),
  selfieChooser: useSelfieChooserStore(),
})

// Export individual stores for direct access and inline selectors
export { useNavigationStore } from './navigationStore'
export { usePoseStore } from './poseStore'
export { useSelfieChooserStore } from './selfieChooserStore'

// Re-export useStore from zustand for inline selectors
export { useStore } from 'zustand'
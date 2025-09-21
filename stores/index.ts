// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'
import { usePoseStore } from './poseStore'
import { useSelfieChooserStore } from './selfieChooserStore'
import { usePhotoGenerationStore } from './photoGenerationStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation, pose, selfieChooser, photoGeneration } = useAppStores()
 * selfieChooser.setSelectedSelfie(selectedSelfie)
 * photoGeneration.startGeneration(pose, selfie, posePrompt)
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
  pose: usePoseStore(),
  selfieChooser: useSelfieChooserStore(),
  photoGeneration: usePhotoGenerationStore(),
})

// Export individual stores for direct access and inline selectors
export { useNavigationStore } from './navigationStore'
export { usePoseStore } from './poseStore'
export { useSelfieChooserStore } from './selfieChooserStore'
export { usePhotoGenerationStore } from './photoGenerationStore'

// Re-export useStore from zustand for inline selectors
export { useStore } from 'zustand'
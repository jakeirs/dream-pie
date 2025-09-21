// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'
import { usePoseStore } from './poseStore'
import { useSelfieChooserStore } from './selfieChooserStore'
import { usePhotoGenerationStore } from './photoGenerationStore'
import { useCreationStore } from './creationStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation, pose, selfieChooser, photoGeneration, creation } = useAppStores()
 * selfieChooser.setSelectedSelfie(selectedSelfie)
 * photoGeneration.startGeneration(pose, selfie, posePrompt)
 * creation.setCreations(mockCreations)
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
  pose: usePoseStore(),
  selfieChooser: useSelfieChooserStore(),
  photoGeneration: usePhotoGenerationStore(),
  creation: useCreationStore(),
})

// Export individual stores for direct access and inline selectors
export { useNavigationStore } from './navigationStore'
export { usePoseStore } from './poseStore'
export { useSelfieChooserStore } from './selfieChooserStore'
export { usePhotoGenerationStore } from './photoGenerationStore'
export { useCreationStore } from './creationStore'

// Re-export useStore from zustand for inline selectors
export { useStore } from 'zustand'
import { useAppStores } from '@/stores'
import { useFal } from '@/shared/hooks'
import { getPosePromptByPoseId } from '@/mockData/prompts/posePrompts'

/**
 * Photo Generation Logic Hook
 *
 * Orchestrates the complete AI photo generation flow:
 * 1. Validates selected selfie and pose
 * 2. Retrieves pose prompt using posePromptId
 * 3. Calls FAL AI with selfie image and pose prompt
 * 4. Manages generation state through photoGeneration store
 *
 * Usage:
 * const { generatePhoto, canGenerate } = useGeneratePhotoLogic()
 * // Call generatePhoto() when user clicks "Generate Photo (real)" button
 */
export const useGeneratePhotoLogic = () => {
  const { pose, selfieChooser, photoGeneration } = useAppStores()

  // Initialize shared FAL hook with callbacks to update photoGeneration store
  const { handleImageEdit } = useFal({
    onStart: () => {
      // Start generation is handled in generatePhoto function
    },
    onSuccess: (response) => {
      photoGeneration.setResult(response)
      photoGeneration.completeGeneration()
    },
    onError: (error) => {
      photoGeneration.setError(error)
      photoGeneration.completeGeneration()
    },
  })

  // Main generation function
  const generatePhoto = async () => {
    // Validation: Check if both selfie and pose are selected
    if (!selfieChooser.selectedSelfie) {
      photoGeneration.setError('Please select a selfie first')
      return
    }

    if (!pose.selectedPose) {
      photoGeneration.setError('Please select a pose first')
      return
    }

    // Get pose prompt using the posePromptId from the selected pose
    const posePrompt = getPosePromptByPoseId(pose.selectedPose.id)
    if (!posePrompt) {
      photoGeneration.setError('Pose prompt not found for selected pose')
      return
    }

    try {
      // Start generation with selected inputs
      photoGeneration.startGeneration(
        pose.selectedPose,
        selfieChooser.selectedSelfie,
        posePrompt
      )

      // Call FAL AI with selfie image URL and pose prompt
      await handleImageEdit(
        selfieChooser.selectedSelfie.imageUrl,
        posePrompt.prompt
      )
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate photo'
      photoGeneration.setError(errorMessage)
      photoGeneration.completeGeneration()
    }
  }

  // Helper to check if generation can proceed
  const canGenerate = Boolean(
    selfieChooser.selectedSelfie &&
    pose.selectedPose &&
    !photoGeneration.isProcessing
  )

  // Helper to get current generation status
  const getGenerationStatus = () => {
    if (photoGeneration.isProcessing) return 'Generating your photo...'
    if (photoGeneration.error) return `Error: ${photoGeneration.error}`
    if (photoGeneration.result) return 'Photo generated successfully!'
    return 'Ready to generate'
  }

  return {
    // Main Actions
    generatePhoto,

    // State Helpers
    canGenerate,
    getGenerationStatus,

    // Direct State Access (for UI components)
    isProcessing: photoGeneration.isProcessing,
    result: photoGeneration.result,
    error: photoGeneration.error,
    usedPose: photoGeneration.usedPose,
    usedSelfie: photoGeneration.usedSelfie,
    usedPosePrompt: photoGeneration.usedPosePrompt,

    // Store Actions (for manual control)
    resetGeneration: photoGeneration.reset,
  }
}
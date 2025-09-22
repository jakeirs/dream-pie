import { useEffect } from 'react'
import {
  usePoseStore,
  useSelfieChooserStore,
  usePhotoGenerationStore,
  useCreationStore,
  useStore,
} from '@/stores'
import { useFal } from '@/shared/hooks'
import { convertImageForFal } from '@/shared/utils'
import { getPosePromptByPoseId } from '@/mockData/prompts/posePrompts'
import { Creation } from '@/types/dream'

/**
 * Photo Generation Logic Hook
 *
 * Orchestrates the complete AI photo generation flow:
 * 1. Validates selected selfie and pose
 * 2. Converts selfie image to base64 format for FAL API
 * 3. Retrieves pose prompt using posePromptId
 * 4. Calls FAL AI with converted image and pose prompt
 * 5. Manages generation state through photoGeneration store
 *
 * Usage:
 * const { generatePhoto, canGenerate } = useGeneratePhotoLogic()
 * // Call generatePhoto() when user clicks "Generate Photo (real)" button
 */
export const useGeneratePhotoLogic = () => {
  // Optimized selectors: Only re-render when specific properties change
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)
  const photoGeneration = usePhotoGenerationStore()

  // Selective subscriptions for creation saving performance optimization
  const addCreation = useStore(useCreationStore, (state) => state.addCreation)
  const result = useStore(usePhotoGenerationStore, (state) => state.result)
  const usedPose = useStore(usePhotoGenerationStore, (state) => state.usedPose)
  const usedSelfie = useStore(usePhotoGenerationStore, (state) => state.usedSelfie)

  useEffect(() => {
    if (result && result.imageUrl && usedPose && usedSelfie) {
      const creation: Creation = {
        id: crypto.randomUUID(),
        usedPose,
        usedSelfie,
        imageUrl: result.imageUrl,
        generatedAt: new Date().toISOString(),
      }
      addCreation(creation)
      console.log('New creation added:', creation)
    }
  }, [result, usedPose, usedSelfie, addCreation])

  // Initialize shared FAL hook with callbacks to update photoGeneration store
  const { handleImageEdit } = useFal({
    onStart: () => {},
    onSuccess: (response) => {
      console.log('FAL Response:', response)
      photoGeneration.setResult(response)
      photoGeneration.completeGeneration()
    },
    onError: (error) => {
      photoGeneration.setError(error)
      photoGeneration.completeGeneration()
    },
  })

  // Main generation function with image conversion
  const generatePhoto = async () => {
    // Validation: Check if both selfie and pose are selected
    if (!selectedSelfie) {
      photoGeneration.setError('Please select a selfie first')
      return
    }

    if (!selectedPose) {
      photoGeneration.setError('Please select a pose first')
      return
    }

    // Get pose prompt using the posePromptId from the selected pose
    const posePrompt = getPosePromptByPoseId(selectedPose.id)
    if (!posePrompt) {
      photoGeneration.setError('Pose prompt not found for selected pose')
      return
    }

    try {
      // Start generation with selected inputs
      photoGeneration.startGeneration(selectedPose, selectedSelfie, posePrompt)

      // Create AbortController for cancellation support
      const abortController = new AbortController()
      photoGeneration.setAbortController(abortController)

      // Convert image to base64 format for FAL API
      let convertedImageData: string
      try {
        convertedImageData = await convertImageForFal(selectedSelfie.imageUrl)
        console.log('selectedSelfie.imageUrl', selectedSelfie.imageUrl)
        console.log('convertedImageData', convertedImageData)
      } catch (conversionError) {
        const errorMessage =
          conversionError instanceof Error
            ? conversionError.message
            : 'Failed to prepare image for generation'
        photoGeneration.setError(`Image conversion failed: ${errorMessage}`)
        return
      }

      // Call FAL AI with converted base64 image and pose prompt
      await handleImageEdit(convertedImageData, posePrompt.prompt, abortController.signal)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate photo'
      photoGeneration.setError(errorMessage)
      photoGeneration.completeGeneration()
    }
  }

  // Helper to check if generation can proceed
  const canGenerate = Boolean(selectedSelfie && selectedPose && !photoGeneration.isProcessing)

  // Helper to get current generation status
  const getGenerationStatus = () => {
    if (photoGeneration.isCancelling) return 'Cancelling generation...'
    if (photoGeneration.isProcessing) return 'Generating your photo...'
    if (photoGeneration.error) return `Error: ${photoGeneration.error}`
    if (photoGeneration.result) return 'Photo generated successfully!'
    return 'Ready to generate'
  }

  // Stop generation function
  const stopGeneration = () => {
    photoGeneration.cancelGeneration()
  }

  return {
    // Main Actions
    generatePhoto,
    stopGeneration,

    // State Helpers
    canGenerate,
    getGenerationStatus,

    // Direct State Access (for UI components)
    isProcessing: photoGeneration.isProcessing,
    isCancelling: photoGeneration.isCancelling,
    result: photoGeneration.result,
    error: photoGeneration.error,
    usedPose: photoGeneration.usedPose,
    usedSelfie: photoGeneration.usedSelfie,
    usedPosePrompt: photoGeneration.usedPosePrompt,

    // Store Actions (for manual control)
    resetGeneration: photoGeneration.reset,
  }
}

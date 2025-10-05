import { useEffect } from 'react'
import * as Crypto from 'expo-crypto'
import {
  usePoseStore,
  useSelfieChooserStore,
  usePhotoGenerationStore,
  useCreationStore,
  useStore,
} from '@/stores'
import { useFal } from '@/shared/hooks'
import { convertImageForFal } from '@/shared/utils'
import { Creation } from '@/types/dream'
import { MAIN_PROMPT } from '@/shared/prompts/mainPrompt'

/**
 * Photo Generation Logic Hook
 *
 * Orchestrates the complete AI photo generation flow with validation:
 * 1. Validates selected selfie and pose
 * 2. Converts images to base64 format for FAL API
 * 3. Calls FAL AI with collage, selfie, and pose images
 * 4. Automatic validation and fallback regeneration if needed
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
  const addCreationAndWait = useStore(useCreationStore, (state) => state.addCreationAndWait)
  const result = useStore(usePhotoGenerationStore, (state) => state.result)
  const usedPose = useStore(usePhotoGenerationStore, (state) => state.usedPose)
  const usedSelfie = useStore(usePhotoGenerationStore, (state) => state.usedSelfie)

  useEffect(() => {
    if (result && result.imageUrl && usedPose && usedSelfie) {
      const creation: Creation = {
        id: Crypto.randomUUID(),
        name: usedPose.name,
        usedPose,
        usedSelfie,
        imageUrl: result.imageUrl,
        generatedAt: new Date().toISOString(),
      }
      addCreationAndWait(creation)
    }
  }, [result, usedPose, usedSelfie, addCreationAndWait])

  // Handle collage image generation when collageImageUri is available
  const handleCollageImageGeneration = async () => {
    try {
      // Convert collage image to base64 format for FAL API
      let convertedCollageImage: string
      try {
        convertedCollageImage = await convertImageForFal(photoGeneration.collageImageUri)
      } catch (conversionError) {
        const errorMessage =
          conversionError instanceof Error
            ? conversionError.message
            : 'Failed to prepare collage image for generation'
        photoGeneration.setError(`Image conversion failed: ${errorMessage}`)
        return
      }

      // Convert selfie image to base64 (for validation)
      let convertedSelfieImage: string | undefined
      if (usedSelfie) {
        try {
          convertedSelfieImage = await convertImageForFal(usedSelfie.imageUrl)
        } catch (conversionError) {
          console.warn(
            'Failed to convert selfie image, proceeding without validation:',
            conversionError
          )
          convertedSelfieImage = undefined
        }
      }

      // Convert pose image to base64 (for fallback description)
      let convertedPoseImage: string
      if (usedPose) {
        try {
          convertedPoseImage = await convertImageForFal(usedPose.imageUrl)
        } catch (conversionError) {
          const errorMessage =
            conversionError instanceof Error
              ? conversionError.message
              : 'Failed to prepare pose image for generation'
          photoGeneration.setError(`Pose image conversion failed: ${errorMessage}`)
          return
        }
      } else {
        photoGeneration.setError('No pose selected')
        return
      }

      // Create AbortController for cancellation support
      const abortController = new AbortController()
      photoGeneration.setAbortController(abortController)

      // Call FAL AI with new object-based parameters
      await handleImageEdit({
        collageImage: convertedCollageImage,
        selfieImage: convertedSelfieImage,
        poseImage: convertedPoseImage,
        prompt: MAIN_PROMPT,
        abortSignal: abortController.signal,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate photo'
      photoGeneration.setError(errorMessage)
      photoGeneration.completeGeneration()
    }
  }

  useEffect(() => {
    if (photoGeneration.collageImageUri && photoGeneration.isProcessing) {
      handleCollageImageGeneration()
    }
  }, [photoGeneration.collageImageUri, photoGeneration.isProcessing])

  // Initialize shared FAL hook with callbacks to update photoGeneration store
  const { handleImageEdit } = useFal({
    onStart: () => {},
    onSuccess: (response) => {
      console.log('Validation details:', {
        confidence: response.confidence,
        wasRegenerated: response.wasRegenerated,
      })
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

    photoGeneration.startGeneration(selectedPose, selectedSelfie)

    // Create AbortController for cancellation support
    const abortController = new AbortController()
    photoGeneration.setAbortController(abortController)
  }

  // Helper to check if generation can proceed
  const canGenerate = Boolean(selectedSelfie && selectedPose && !photoGeneration.isProcessing)

  // Helper to get current generation status
  const getGenerationStatus = () => {
    if (photoGeneration.isCancelling) return 'Cancelling generation...'
    if (photoGeneration.isProcessing) return 'Generating your photo...'
    if (photoGeneration.error) return `Error: ${photoGeneration.error}`
    if (photoGeneration.result) {
      // Show validation details if available
      if (photoGeneration.result.wasRegenerated) {
        return 'Photo regenerated with fallback (validation failed)'
      }
      if (photoGeneration.result.confidence) {
        return `Photo generated successfully! (Confidence: ${(photoGeneration.result.confidence * 100).toFixed(0)}%)`
      }
      return 'Photo generated successfully!'
    }
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

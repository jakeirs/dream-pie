import { useEffect } from 'react'
import * as Crypto from 'expo-crypto'
import { usePhotoGenerationStore, useCreationStore, useStore } from '@/stores'
import { useFal } from '@/shared/hooks'
import { convertImageForFal } from '@/shared/utils'
import { Creation } from '@/types/dream'
import { MAIN_PROMPT } from '@/shared/prompts/mainPrompt'

/**
 * Photo Generation Logic Hook
 *
 * Orchestrates the complete AI photo generation flow:
 * 1. Converts images to base64 format for FAL API
 * 2. Calls FAL AI with collage, selfie, and pose images
 * 3. Automatic validation and fallback regeneration if needed
 * 4. Manages generation state through photoGeneration store
 * 5. Auto-saves creation when result is ready
 *
 * Usage:
 * const { generatePhoto, isProcessing } = useGeneratePhotoLogic()
 * // Call generatePhoto() from Generation Page
 */
export const useGeneratePhotoLogic = () => {
  const photoGeneration = usePhotoGenerationStore()

  // Selective subscriptions for creation saving performance optimization
  const addCreationAndWait = useStore(useCreationStore, (state) => state.addCreationAndWait)
  const result = useStore(usePhotoGenerationStore, (state) => state.result)
  const usedPose = useStore(usePhotoGenerationStore, (state) => state.usedPose)
  const usedSelfie = useStore(usePhotoGenerationStore, (state) => state.usedSelfie)

  // Auto-save creation when result is ready
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

  // Main generation function - Triggers collage generation via AbortController
  const generatePhoto = () => {
    // Create AbortController for cancellation support
    const abortController = new AbortController()
    photoGeneration.setAbortController(abortController)
  }

  // Stop generation function
  const stopGeneration = () => {
    photoGeneration.cancelGeneration()
  }

  return {
    // Main Actions
    generatePhoto,
    stopGeneration,

    // Direct State Access (for UI components)
    isProcessing: photoGeneration.isProcessing,
    isCancelling: photoGeneration.isCancelling,
    result: photoGeneration.result,
    error: photoGeneration.error,
  }
}

import { useCallback } from 'react'

import { useCanvasRef, useImage } from '@shopify/react-native-skia'
import { useStore } from 'zustand'

import { usePhotoGenerationStore, usePoseStore, useSelfieChooserStore } from '@/stores'
import { getDualImageCollageConfig } from './utils/imageUtils'
import { calculateDualImageLayout, exportCollageToFile } from './utils/collageRenderer'

export function useCollageGeneration() {
  const selectedPose = useStore(usePoseStore, (state) => state.selectedPose)
  const selectedSelfie = useStore(useSelfieChooserStore, (state) => state.selectedSelfie)
  const setCollageImageUri = useStore(usePhotoGenerationStore, (state) => state.setCollageImageUri)

  const selfieImage = useImage(selectedSelfie?.imageUrl)
  const poseImage = useImage(selectedPose?.imageUrl)

  const canvasRef = useCanvasRef()

  // canvas config
  const config = getDualImageCollageConfig(poseImage?.width(), poseImage?.height())

  const layout = calculateDualImageLayout(selfieImage!, poseImage!, config)

  const generateCollage = useCallback(async () => {
    try {
      // Wait a brief moment to allow canvas to render
      await new Promise((resolve) => setTimeout(resolve, 300))

      // Export canvas to file with configuration
      const imageUri = await exportCollageToFile(canvasRef, config)
      setCollageImageUri(imageUri)

      if (!imageUri) {
        throw new Error('Failed to generate collage image')
      }
    } catch (error) {
      console.error('Error generating collage:', error)
    }
  }, [canvasRef, config])

  return {
    generateCollage,
    selfieImage,
    poseImage,
    canvasRef,
    config,
    layout,
  }
}

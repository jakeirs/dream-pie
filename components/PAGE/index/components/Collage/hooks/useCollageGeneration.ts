/**
 * USE COLLAGE GENERATION HOOK
 *
 * State management for collage creation process
 * Handles generation states, errors, and coordinates the collage creation workflow
 */

import { useState, useCallback } from 'react'
import { useCanvasRef } from '@shopify/react-native-skia'
import { useSelfieChooserStore } from '@/stores/selfieChooserStore'
import { usePoseStore } from '@/stores/poseStore'
import { CollageGenerationState, ShareResult, CollageConfig } from '../types'
import { exportCollageToFile } from '../utils/collageRenderer'
import { shareCollageImage, isShareSupported as checkShareSupport } from '../utils/shareUtils'
import { getDefaultCollageConfig, getDualImageCollageConfig } from '../utils/imageUtils'

export function useCollageGeneration() {
  const { selectedSelfie } = useSelfieChooserStore()
  const { selectedPose } = usePoseStore()
  const canvasRef = useCanvasRef()

  // Dynamic config based on whether we have both images
  const config = selectedSelfie && selectedPose
    ? getDualImageCollageConfig(800, 600) // Default size, will be updated when images load
    : getDefaultCollageConfig()

  const [state, setState] = useState<CollageGenerationState>({
    isGenerating: false,
    isReady: false,
    error: null,
    collageImageUri: null,
  })

  const [shareSupported, setShareSupported] = useState<boolean>(false)

  // Check share support on hook initialization
  const checkShareSupportFunc = useCallback(async () => {
    const supported = await checkShareSupport()
    setShareSupported(supported)
  }, [])

  // Generate collage from current selected selfie and pose
  const generateCollage = useCallback(async () => {
    if (!selectedSelfie) {
      setState((prev) => ({
        ...prev,
        error: 'No selfie selected. Please select a selfie first.',
      }))
      return
    }

    if (!selectedPose) {
      setState((prev) => ({
        ...prev,
        error: 'No pose selected. Please select a pose first.',
      }))
      return
    }

    setState((prev) => ({
      ...prev,
      isGenerating: true,
      error: null,
      collageImageUri: null,
      isReady: false,
    }))

    try {
      // Wait a brief moment to allow canvas to render
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Export canvas to file with configuration
      const imageUri = await exportCollageToFile(canvasRef, config)

      if (!imageUri) {
        throw new Error('Failed to generate collage image')
      }

      setState((prev) => ({
        ...prev,
        isGenerating: false,
        isReady: true,
        collageImageUri: imageUri,
        error: null,
      }))
    } catch (error) {
      console.error('Error generating collage:', error)
      setState((prev) => ({
        ...prev,
        isGenerating: false,
        isReady: false,
        error: error instanceof Error ? error.message : 'Failed to generate collage',
      }))
    }
  }, [selectedSelfie, selectedPose])

  // Share the generated collage
  const shareCollage = useCallback(async (): Promise<ShareResult> => {
    if (!state.collageImageUri) {
      return {
        success: false,
        error: 'No collage available to share',
      }
    }

    try {
      const result = await shareCollageImage(state.collageImageUri)
      return result
    } catch (error) {
      console.error('Error sharing collage:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown sharing error',
      }
    }
  }, [state.collageImageUri])

  // Reset collage generation state
  const resetCollage = useCallback(() => {
    setState({
      isGenerating: false,
      isReady: false,
      error: null,
      collageImageUri: null,
    })
  }, [])

  return {
    // State
    state,
    selectedSelfie,
    selectedPose,
    canvasRef,
    shareSupported,
    config,

    // Actions
    generateCollage,
    shareCollage,
    resetCollage,
    checkShareSupport: checkShareSupportFunc,

    // Computed values
    canGenerate: !!selectedSelfie && !!selectedPose && !state.isGenerating,
    canShare: state.isReady && !!state.collageImageUri && shareSupported,
  }
}
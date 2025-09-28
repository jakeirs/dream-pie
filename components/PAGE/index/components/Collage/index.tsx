/**
 * COLLAGE GENERATOR COMPONENT
 *
 * Main component for the collage generation feature
 * Handles the complete workflow from generation to sharing
 */

import { useEffect } from 'react'
import { View, Text, ActivityIndicator, Alert } from 'react-native'

import Button from '@/components/ui/Button/Button'
import CollageCanvas from './CollageCanvas'
import CollagePreview from './CollagePreview'
import { useCollageGeneration } from './hooks/useCollageGeneration'

interface CollageGeneratorProps {
  visible?: boolean
}

export default function CollageGenerator({ visible = true }: CollageGeneratorProps) {
  const {
    state,
    selectedSelfie,
    selectedPose,
    canvasRef,
    config,
    generateCollage,
    resetCollage,
    canGenerate,
  } = useCollageGeneration()

  const handleGenerateCollage = async () => {
    await generateCollage()
  }

  if (!visible) return null

  return (
    <View className="flex-1 space-y-6 p-4">
      {/* Generation Button */}
      {!state.isReady && (
        <View className="items-center">
          <Button
            title={state.isGenerating ? 'Generating...' : 'Create Collage'}
            onPress={handleGenerateCollage}
            disabled={!canGenerate}
            variant="primary"
            size="lg"
          />
        </View>
      )}

      <CollageCanvas
        ref={canvasRef}
        selfie={selectedSelfie}
        referencePhoto={selectedPose}
        visible={state.isGenerating || state.isReady}
        config={config}
      />

      {/* Preview and Share */}
      <CollagePreview state={state} onReset={resetCollage} />
    </View>
  )
}

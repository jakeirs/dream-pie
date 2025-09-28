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

      {/* Loading State */}
      {state.isGenerating && (
        <View className="items-center py-8">
          <ActivityIndicator size="large" color="#4ADE80" />
          <Text className="mt-2 text-textSecondary">Creating your collage...</Text>
        </View>
      )}

      {/* Error State */}
      {state.error && (
        <View className="rounded-lg border border-error/20 bg-error/10 p-3">
          <Text className="font-medium text-error">Error</Text>
          <Text className="text-sm text-error/80">{state.error}</Text>
          <Button
            title="Try Again"
            onPress={resetCollage}
            variant="error"
            size="sm"
            className="mt-2"
          />
        </View>
      )}

      {/* Hidden Canvas for Generation */}

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

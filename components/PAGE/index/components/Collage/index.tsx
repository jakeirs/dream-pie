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
    canvasRef,
    config,
    generateCollage,
    shareCollage,
    resetCollage,
    checkShareSupport,
    canGenerate,
    canShare,
  } = useCollageGeneration()

  // Check share support on mount
  useEffect(() => {
    checkShareSupport()
  }, [checkShareSupport])

  const handleGenerateCollage = async () => {
    if (!selectedSelfie) {
      Alert.alert('No Selfie Selected', 'Please select a selfie first to create a collage.', [
        { text: 'OK' },
      ])
      return
    }

    await generateCollage()
  }

  if (!visible) return null

  return (
    <View className="flex-1 space-y-6 p-4">
      {/* Header */}
      <View className="items-center">
        <Text className="mb-2 text-2xl font-bold text-textPrimary">Collage Creator</Text>
        <Text className="text-center text-textSecondary">
          Create a beautiful collage with your selected selfie
        </Text>
      </View>

      {/* Selected Selfie Info */}
      {selectedSelfie ? (
        <View className="rounded-lg bg-card p-3">
          <Text className="font-medium text-textPrimary">Selected: {selectedSelfie.name}</Text>
          <Text className="text-sm text-textSecondary">{selectedSelfie.description}</Text>
        </View>
      ) : (
        <View className="rounded-lg border border-warning/20 bg-warning/10 p-3">
          <Text className="text-center font-medium text-warning">No selfie selected</Text>
          <Text className="mt-1 text-center text-sm text-warning/80">
            Please select a selfie to create a collage
          </Text>
        </View>
      )}

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
      <View
        style={{
          position: 'absolute',
          left: -9999,
          top: -9999,
          opacity: 0,
        }}>
        <CollageCanvas
          ref={canvasRef}
          selfie={selectedSelfie}
          visible={state.isGenerating || state.isReady}
          config={config}
        />
      </View>

      {/* Preview and Share */}
      <CollagePreview
        state={state}
        onShare={shareCollage}
        onReset={resetCollage}
        canShare={canShare}
      />
    </View>
  )
}

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
    shareSupported,
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
      Alert.alert(
        'No Selfie Selected',
        'Please select a selfie first to create a collage.',
        [{ text: 'OK' }]
      )
      return
    }

    await generateCollage()
  }

  if (!visible) return null

  return (
    <View className="flex-1 p-4 space-y-6">
      {/* Header */}
      <View className="items-center">
        <Text className="text-2xl font-bold text-textPrimary mb-2">
          Collage Creator
        </Text>
        <Text className="text-textSecondary text-center">
          Create a beautiful collage with your selected selfie
        </Text>
      </View>

      {/* Selected Selfie Info */}
      {selectedSelfie ? (
        <View className="bg-card rounded-lg p-3">
          <Text className="text-textPrimary font-medium">
            Selected: {selectedSelfie.name}
          </Text>
          <Text className="text-textSecondary text-sm">
            {selectedSelfie.description}
          </Text>
        </View>
      ) : (
        <View className="bg-warning/10 rounded-lg p-3 border border-warning/20">
          <Text className="text-warning font-medium text-center">
            No selfie selected
          </Text>
          <Text className="text-warning/80 text-sm text-center mt-1">
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
          <Text className="text-textSecondary mt-2">Creating your collage...</Text>
        </View>
      )}

      {/* Error State */}
      {state.error && (
        <View className="bg-error/10 rounded-lg p-3 border border-error/20">
          <Text className="text-error font-medium">Error</Text>
          <Text className="text-error/80 text-sm">{state.error}</Text>
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
        }}
      >
        <CollageCanvas
          ref={canvasRef}
          selfie={selectedSelfie}
          visible={state.isGenerating || state.isReady}
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
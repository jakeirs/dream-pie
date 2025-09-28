/**
 * COLLAGE PREVIEW COMPONENT
 *
 * Display generated collage with sharing functionality
 * Shows the final collage and provides share button
 */

import { View, Text } from 'react-native'
import { Image } from 'expo-image'

import Button from '@/components/ui/Button/Button'
import { CollageGenerationState } from './types'

interface CollagePreviewProps {
  state: CollageGenerationState
  onReset: () => void
}

export default function CollagePreview({ state, onReset }: CollagePreviewProps) {
  if (!state.isReady || !state.collageImageUri) {
    return null
  }

  return (
    <View className="items-center space-y-4">
      {/* Preview Title */}
      <Text className="text-xl font-bold text-textPrimary">Your Dream Pie Collage</Text>

      {/* Generated Collage Preview */}
      <View className="rounded-lg bg-card p-4 shadow-md">
        <Image
          source={{ uri: state.collageImageUri }}
          style={{
            width: 300,
            height: 300,
            borderRadius: 12,
          }}
          contentFit="contain"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
      </View>

      {/* Action Buttons */}
      <View className="flex-row space-x-3">
        <Button title="Create Another" onPress={onReset} variant="secondary" size="md" />
      </View>
    </View>
  )
}

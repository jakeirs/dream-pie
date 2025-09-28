/**
 * COLLAGE PREVIEW COMPONENT
 *
 * Display generated collage with sharing functionality
 * Shows the final collage and provides share button
 */

import { View, Text, Alert } from 'react-native'
import { Image } from 'expo-image'

import Button from '@/components/ui/Button/Button'
import { CollageGenerationState, ShareResult } from './types'

interface CollagePreviewProps {
  state: CollageGenerationState
  onShare: () => Promise<ShareResult>
  onReset: () => void
  canShare: boolean
}

export default function CollagePreview({
  state,
  onShare,
  onReset,
  canShare,
}: CollagePreviewProps) {
  const handleShare = async () => {
    const result = await onShare()

    if (result.success) {
      Alert.alert('Success', 'Collage shared successfully!', [{ text: 'OK' }])
    } else {
      Alert.alert(
        'Share Failed',
        result.error || 'Failed to share collage. Please try again.',
        [{ text: 'OK' }]
      )
    }
  }

  if (!state.isReady || !state.collageImageUri) {
    return null
  }

  return (
    <View className="items-center space-y-4">
      {/* Preview Title */}
      <Text className="text-xl font-bold text-textPrimary">
        Your Dream Pie Collage
      </Text>

      {/* Generated Collage Preview */}
      <View className="bg-card rounded-lg p-4 shadow-md">
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
        {/* Share Button */}
        <Button
          title="Share Collage"
          onPress={handleShare}
          disabled={!canShare}
          variant="primary"
          size="md"
        />

        {/* Generate Another Button */}
        <Button
          title="Create Another"
          onPress={onReset}
          variant="secondary"
          size="md"
        />
      </View>

      {/* Share Status Message */}
      {!canShare && (
        <Text className="text-sm text-textSecondary text-center">
          Sharing is not available on this device
        </Text>
      )}
    </View>
  )
}
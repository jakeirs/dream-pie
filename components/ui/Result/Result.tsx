import { View, Text, ScrollView } from 'react-native'

import Button from '@/components/ui/Button/Button'
import ResultPhoto from '@/components/ui/ResultPhoto/ResultPhoto'
import { FalResponse } from '@/types'
import { brandColors } from '@/shared/theme'

interface ResultProps {
  result?: FalResponse | null
  error?: string | null
  isProcessing?: boolean
  isConvertingImage?: boolean
  isGenerating?: boolean
  onRetry?: () => void
  onClose?: () => void
}

export default function Result({
  result,
  error,
  isProcessing = false,
  isConvertingImage = false,
  isGenerating = false,
  onRetry,
  onClose
}: ResultProps) {
  // Multi-stage Processing State
  if (isProcessing || isConvertingImage || isGenerating) {
    // Image Conversion Stage
    if (isConvertingImage) {
      return (
        <View className="items-center py-6">
          <View
            className="mb-4 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: brandColors.accent }}>
            <Text className="text-2xl">📷</Text>
          </View>
          <Text className="mb-2 text-xl font-bold text-textPrimary">Preparing Image</Text>
          <Text className="text-center text-textSecondary">
            Converting your selfie for AI processing...
          </Text>
        </View>
      )
    }

    // AI Generation Stage
    if (isGenerating) {
      return (
        <View className="items-center py-6">
          <View
            className="mb-4 h-16 w-16 items-center justify-center rounded-full"
            style={{ backgroundColor: brandColors.primary }}>
            <Text className="text-2xl">🎨</Text>
          </View>
          <Text className="mb-2 text-xl font-bold text-textPrimary">Generating Photo</Text>
          <Text className="text-center text-textSecondary">
            Your AI photo is being created...
          </Text>
        </View>
      )
    }

    // Fallback Processing State
    return (
      <View className="items-center py-6">
        <View
          className="mb-4 h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: brandColors.primary }}>
          <Text className="text-2xl">⚙️</Text>
        </View>
        <Text className="mb-2 text-xl font-bold text-textPrimary">Processing</Text>
        <Text className="text-center text-textSecondary">
          Please wait while we process your request...
        </Text>
      </View>
    )
  }

  // Error State
  if (error) {
    return (
      <View className="items-center py-4">
        <View
          className="mb-4 h-16 w-16 items-center justify-center rounded-full"
          style={{ backgroundColor: brandColors.error }}>
          <Text className="text-2xl">⚠️</Text>
        </View>
        <Text className="mb-3 text-xl font-bold text-textPrimary">Generation Failed</Text>

        <ScrollView className="mb-4 max-h-24 w-full">
          <Text className="text-center text-textSecondary">{error}</Text>
        </ScrollView>

        <View className="w-full space-y-3">
          {onRetry && (
            <Button
              onPress={onRetry}
              variant="primary"
              className="w-full">
              <Text className="font-bold text-white">🔄 Try Again</Text>
            </Button>
          )}

          {onClose && (
            <Button
              onPress={onClose}
              variant="secondary"
              className="w-full">
              <Text className="font-bold text-textPrimary">Close</Text>
            </Button>
          )}
        </View>
      </View>
    )
  }

  // Success State
  if (result) {
    return (
      <View className="py-2">
        {/* Success Header */}
        <View className="mb-4 items-center">
          <View
            className="mb-2 h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: brandColors.success }}>
            <Text className="text-xl">✨</Text>
          </View>
          <Text className="text-lg font-bold text-textPrimary">Photo Generated!</Text>
        </View>

        {/* Generated Image */}
        <View className="mb-4">
          <ResultPhoto imageUrl={result.imageUrl} width={280} height={180} />
        </View>

        {/* Description */}
        {result.description && (
          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-textPrimary">Description:</Text>
            <ScrollView className="max-h-20">
              <Text className="text-textSecondary">{result.description}</Text>
            </ScrollView>
          </View>
        )}

        {/* Metadata */}
        <View className="space-y-2">
          <View>
            <Text className="text-xs font-semibold text-textPrimary">Request ID:</Text>
            <Text className="font-mono text-xs text-textTertiary">
              {result.requestId}
            </Text>
          </View>

          <View>
            <Text className="text-xs font-semibold text-textPrimary">File Details:</Text>
            <Text className="text-xs text-textTertiary">
              {result.fileName} • {result.contentType}
            </Text>
          </View>
        </View>

        {/* Close Button */}
        {onClose && (
          <View className="mt-6">
            <Button
              onPress={onClose}
              variant="primary"
              className="w-full">
              <Text className="font-bold text-white">Perfect! 🎉</Text>
            </Button>
          </View>
        )}
      </View>
    )
  }

  // Default Empty State
  return (
    <View className="items-center py-6">
      <Text className="text-textSecondary">No results to display</Text>
    </View>
  )
}
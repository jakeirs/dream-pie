import React, { useEffect } from 'react'
import { View, Text, Image } from 'react-native'
import { useAppStores } from '@/stores'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function GenerationPage() {
  const { generation, pose, photo } = useAppStores()

  useEffect(() => {
    // If no generation in progress, redirect back
    if (generation.status === 'idle') {
      router.replace('/(tabs)/index')
      return
    }

    // Navigate to result when complete
    if (generation.status === 'complete') {
      router.replace('/(creation)/result')
    }
  }, [generation.status])

  const progressPercentage = generation.progress?.progress || 0
  const currentMessage = generation.progress?.message || 'Preparing...'
  const estimatedTime = generation.getEstimatedTimeRemaining()

  return (
    <View className="flex-1 bg-background justify-center items-center px-8">

      {/* Main Animation Area */}
      <View className="items-center mb-12">
        {/* Selected Photo Preview */}
        {photo.selectedPhoto && (
          <View className="relative mb-8">
            <Image
              source={{ uri: photo.selectedPhoto }}
              className="w-32 h-32 rounded-full"
              resizeMode="cover"
            />
            <View className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2">
              <Text className="text-xl">✨</Text>
            </View>
          </View>
        )}

        {/* Loading Animation */}
        <View className="w-24 h-24 mb-6 bg-card rounded-full justify-center items-center">
          <Text className="text-3xl animate-spin">🎨</Text>
        </View>

        {/* Progress Bar */}
        <View className="w-64 h-2 bg-cardSecondary rounded-full mb-4">
          <View
            className="h-full rounded-full transition-all duration-300"
            style={{
              backgroundColor: brandColors.primary,
              width: `${Math.min(progressPercentage, 100)}%`
            }}
          />
        </View>

        {/* Progress Percentage */}
        <Text className="text-2xl font-bold text-textPrimary mb-2">
          {Math.round(progressPercentage)}%
        </Text>
      </View>

      {/* Status Message */}
      <View className="items-center mb-8">
        <Text className="text-lg text-textPrimary text-center mb-2">
          {currentMessage}
        </Text>

        {estimatedTime > 0 && (
          <Text className="text-sm text-textSecondary">
            About {estimatedTime} seconds remaining
          </Text>
        )}
      </View>

      {/* Selected Pose Info */}
      {pose.selectedPose && (
        <View className="bg-card rounded-xl p-4 w-full">
          <Text className="text-sm text-textSecondary mb-1">Creating with:</Text>
          <Text className="text-base font-semibold text-textPrimary">
            {pose.selectedPose.name}
          </Text>
          <Text className="text-sm text-textSecondary">
            {pose.selectedPose.category.charAt(0).toUpperCase() + pose.selectedPose.category.slice(1)} style
          </Text>
        </View>
      )}

      {/* Error State */}
      {generation.status === 'error' && (
        <View className="absolute bottom-20 left-8 right-8">
          <View className="bg-error rounded-xl p-4">
            <Text className="text-white text-center font-medium mb-2">
              Something went wrong
            </Text>
            <Text className="text-white/80 text-center text-sm">
              {generation.error}
            </Text>
          </View>
        </View>
      )}
    </View>
  )
}
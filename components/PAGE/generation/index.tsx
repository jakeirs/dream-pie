import React from 'react'
import { View, Text } from 'react-native'
import { Button } from '@/components/ui'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function GenerationPage() {
  const handleNext = () => {
    router.push('/(creation)/result')
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Header */}
        <Text className="mb-8 text-center text-4xl font-bold text-textPrimary">
          Generation Screen
        </Text>

        <Text className="mb-12 text-center text-lg text-textSecondary">
          We are generating your amazing photo...{'\n'}
          This process usually takes a few seconds.{'\n'}
          Please wait while we create your masterpiece!
        </Text>

        {/* Loading indicator simulation */}
        <View className="mb-12 h-4 w-full max-w-sm overflow-hidden rounded-full bg-cardSecondary">
          <View
            className="h-full rounded-full"
            style={{
              backgroundColor: brandColors.primary,
              width: '75%',
            }}
          />
        </View>

        {/* Next Button */}
        <View className="w-full">
          <Button
            onPress={handleNext}
            className="w-full"
            style={{
              backgroundColor: brandColors.primary,
              paddingVertical: 24,
            }}>
            <Text
              className="text-xl font-bold"
              style={{ color: brandColors.primaryForeground }}>
              View Result →
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
import React from 'react'
import { View, Text, Image, ScrollView } from 'react-native'
import Button from '@/components/ui/Button/Button'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'
import { appAssets } from '@/shared/assets/assets'

export default function ResultPage() {
  const handleBackToCreate = () => {
    router.push('/(tabs)')
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <Text className="mb-8 text-center text-4xl font-bold text-textPrimary">Result Page</Text>

        <Text className="mb-8 text-center text-lg text-textSecondary">
          Your photo has been generated successfully!
        </Text>

        {/* Big Image Placeholder */}
        <View className="mb-8 items-center">
          <View
            className="overflow-hidden rounded-2xl"
            style={{
              width: 300,
              height: 400,
              backgroundColor: brandColors.cardSecondary,
            }}>
            <Image
              source={appAssets.selfies.extendPhoto}
              style={{
                width: '100%',
                height: '100%',
                resizeMode: 'cover',
              }}
            />
          </View>
        </View>

        {/* Information about editing */}
        <View className="mb-8 rounded-xl bg-cardSecondary p-4">
          <Text className="mb-2 text-lg font-bold text-textPrimary">✨ About Editing</Text>
          <Text className="text-textSecondary">
            Your photo has been enhanced with AI magic!{'\n'}• Background replaced with dream-like
            scenes{'\n'}• Lighting optimized for perfect shots{'\n'}• Colors enhanced for maximum
            impact{'\n'}• Professional quality guaranteed
          </Text>
        </View>

        {/* Back to Create Button */}
        <Button
          onPress={handleBackToCreate}
          className="w-full"
          style={{
            backgroundColor: brandColors.primary,
            paddingVertical: 24,
          }}>
          <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
            ← Back to Create More
          </Text>
        </Button>
      </View>
    </ScrollView>
  )
}

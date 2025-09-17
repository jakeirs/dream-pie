import React from 'react'
import { View, Text } from 'react-native'
import Button from '@/components/ui/Button/Button'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function OnboardingPage() {
  const handleNext = () => {
    router.push('/(auth)/login')
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Big Header Text */}
        <Text
          className="mb-12 text-center text-6xl font-bold text-textPrimary"
          style={{ lineHeight: 80 }}>
          This is onboarding screen welcome
        </Text>

        {/* Big Next Button */}
        <View className="w-full px-6">
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
              Continue to Login →
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
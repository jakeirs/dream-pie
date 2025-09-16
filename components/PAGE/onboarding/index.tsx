import React from 'react'
import { View, Text } from 'react-native'
import { useAppStores } from '@/stores'
import { Button } from '@/components/ui'
import { router } from 'expo-router'

export default function OnboardingPage() {
  const { onboarding, actions } = useAppStores()

  const handleGetStarted = () => {
    actions.completeOnboardingStep('welcome')
    onboarding.completeOnboarding()
    router.replace('/(tabs)/index')
  }

  return (
    <View className="flex-1 bg-background justify-center items-center px-8">
      <Text className="text-6xl mb-8">🎨</Text>

      <Text className="text-3xl font-bold text-textPrimary text-center mb-4">
        Welcome to Dream Pie
      </Text>

      <Text className="text-lg text-textSecondary text-center mb-12">
        Transform your photos with AI-powered poses and professional styling
      </Text>

      <Button
        onPress={handleGetStarted}
        className="w-full py-4"
        style={{ backgroundColor: '#FDE047' }}>
        <Text className="text-lg font-bold text-black">
          Get Started
        </Text>
      </Button>

      <Text className="text-xs text-textMuted mt-6 text-center">
        By continuing, you agree to our Terms of Service
      </Text>
    </View>
  )
}
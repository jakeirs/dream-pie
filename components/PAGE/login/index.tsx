import React from 'react'
import { View, Text } from 'react-native'
import { Button } from '@/components/ui'
import { router } from 'expo-router'

export default function LoginPage() {
  const handleLogin = () => {
    // In real app, this would handle authentication
    router.replace('/(tabs)/index')
  }

  return (
    <View className="flex-1 bg-background justify-center items-center px-8">
      <Text className="text-6xl mb-8">✨</Text>

      <Text className="text-2xl font-bold text-textPrimary text-center mb-4">
        Sign in to Dream Pie
      </Text>

      <Text className="text-textSecondary text-center mb-12">
        Continue with your account to access all features
      </Text>

      <Button
        onPress={handleLogin}
        className="w-full py-4 mb-4"
        style={{ backgroundColor: '#FDE047' }}>
        <Text className="text-lg font-bold text-black">
          Continue with Google
        </Text>
      </Button>

      <Button
        onPress={handleLogin}
        variant="secondary"
        className="w-full py-4">
        <Text className="text-lg font-medium text-textPrimary">
          Continue with Apple
        </Text>
      </Button>
    </View>
  )
}
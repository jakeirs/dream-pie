import { useState, useRef } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'

import { BottomSheetModal } from '@gorhom/bottom-sheet'

import Button from '@/components/ui/Button/Button'
import BottomSheet from '@/components/ui/BottomSheet/BottomSheet'
import Card from '@/components/ui/Card/Card'
import PaywallContent from '@/components/PAGE/paywall-bottomsheet'

import { brandColors } from '@/shared/theme'
import { GeminiRequest, GeminiResponse, GeminiState } from '@/types'

export default function LoginPage() {
  const paywallRef = useRef<BottomSheetModal>(null)

  const [geminiState, setGeminiState] = useState<GeminiState>({
    response: null,
    isLoading: false,
    error: null,
  })

  const handleLoginAsUser = () => {
    router.push('/(tabs)')
  }

  const handleShowPaywall = () => {
    paywallRef.current?.present()
  }

  const handleMessageToGemini = async () => {
    setGeminiState({ response: null, isLoading: true, error: null })

    try {
      const request: GeminiRequest = { message: 'Hello, who are you?' }

      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const data: GeminiResponse = await response.json()

      if (!response.ok || data.error) {
        throw new Error(data.error || 'Failed to get response from Gemini')
      }

      setGeminiState({
        response: data.text,
        isLoading: false,
        error: null,
      })
    } catch (error) {
      setGeminiState({
        response: null,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Something went wrong',
      })
    }
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1 items-center justify-center px-6">
        {/* Header */}
        <Text className="mb-8 text-center text-4xl font-bold text-textPrimary">
          Welcome to Dream Pie
        </Text>

        <Text className="mb-12 text-center text-lg text-textSecondary">
          Ready to create amazing photos?
        </Text>

        {/* Login Button */}
        <View className="mb-6 w-full">
          <Button
            onPress={handleLoginAsUser}
            className="w-full"
            style={{
              backgroundColor: brandColors.primary,
              paddingVertical: 24,
            }}>
            <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
              Login as User → Go to Main App
            </Text>
          </Button>
        </View>

        {/* Gemini Button */}
        <View className="mb-6 w-full">
          <Button
            onPress={handleMessageToGemini}
            variant="accent"
            className="w-full"
            disabled={geminiState.isLoading}
            style={{ paddingVertical: 24 }}>
            <Text className="text-xl font-bold text-white">
              {geminiState.isLoading ? '🤔 Thinking...' : '🧠 Message to Gemini'}
            </Text>
          </Button>
        </View>

        {/* Paywall Button */}
        <View className="w-full">
          <Button
            onPress={handleShowPaywall}
            variant="success"
            className="w-full"
            style={{ paddingVertical: 24 }}>
            <Text className="text-xl font-bold text-white">🚀 Show Paywall Modal</Text>
          </Button>
        </View>

        {/* Gemini Response */}
        {(geminiState.response || geminiState.error) && (
          <View className="mt-8 w-full">
            <Card
              variant={geminiState.error ? 'danger' : 'info'}
              title={geminiState.error ? '❌ Error' : '🧠 Gemini Response'}
              className="w-full">
              <ScrollView className="max-h-32">
                <Text className="text-base text-textSecondary">
                  {geminiState.error || geminiState.response}
                </Text>
              </ScrollView>
            </Card>
          </View>
        )}
      </View>

      {/* Paywall Modal */}
      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent onClose={() => paywallRef.current?.dismiss()} />
      </BottomSheet>
    </View>
  )
}

import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import PageHeader from '@/components/ui/PageHeader/PageHeader'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'

import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'
import { TestApiPageProps } from './types'
import { useGemini } from './hooks/useGemini'

export default function TestApiPage({ className = '' }: TestApiPageProps) {
  const { geminiState, handleMessageToGemini } = useGemini()

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: brandColors.background }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View className={`flex-1 bg-background ${className}`}>
          <PageHeader
            title="Test API"
            leftIcon={{
              name: 'arrow-left',
              family: ICON_FAMILY_NAME.Feather,
              onPress: handleBack,
            }}
          />

          <ScrollView className="flex-1 px-6">
            <View className="py-6">
              {/* Header */}
              <Text className="mb-2 text-center text-2xl font-bold text-textPrimary">
                API Testing Dashboard
              </Text>
              <Text className="mb-8 text-center text-base text-textSecondary">
                Test various API endpoints and view responses
              </Text>

              {/* API Test Buttons */}
              <View className="space-y-4">
                {/* Real Gemini Button - Same as Login Page */}
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

              {/* Gemini Response - Same as Login Page */}
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
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

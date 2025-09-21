import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'

import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import PageHeader from '@/components/ui/PageHeader/PageHeader'
import Button from '@/components/ui/Button/Button'
import Card from '@/components/ui/Card/Card'
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'
import { TestApiPageProps } from './types'
import { useGemini } from './hooks/useGemini'
import { useFal } from './hooks/useFal'

export default function TestApiPage({ className = '' }: TestApiPageProps) {
  const { geminiState, handleMessageToGemini } = useGemini()
  const { falState, handleImageEdit } = useFal()

  const handleBack = () => {
    router.back()
  }

  const handleGeneratePhoto = () => {
    try {
      // For testing, use a publicly available image URL since FAL requires image URLs
      const testImageUrl =
        'https://storage.googleapis.com/falserverless/example_inputs/nano-banana-edit-input.png'
      // Hardcoded prompt
      const prompt = 'change the clothes to black jacket'

      handleImageEdit(testImageUrl, prompt)
    } catch (error) {
      console.error('Error in handleGeneratePhoto:', error)
    }
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

                {/* FAL AI Generate Photo Button */}
                <Button
                  onPress={handleGeneratePhoto}
                  variant="primary"
                  className="w-full"
                  disabled={falState.isLoading}
                  style={{ paddingVertical: 24 }}>
                  <Text className="text-xl font-bold text-white">
                    {falState.isLoading ? '🎨 Generating...' : '📸 Generate Photo'}
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

              {/* FAL AI Response */}
              {falState.error && (
                <View className="mt-8 w-full">
                  <Card
                    variant="danger"
                    title="❌ FAL AI Error"
                    className="w-full">
                    <ScrollView className="max-h-32">
                      <Text className="text-base text-textSecondary">{falState.error}</Text>
                    </ScrollView>
                  </Card>
                </View>
              )}

              {/* FAL AI Success Response with PhotoCard */}
              {falState.response && !falState.error && (
                <View className="mt-8 w-full space-y-4">
                  {/* Generated Image Display */}
                  <PhotoCard
                    imageSource={{ uri: falState.response.imageUrl }}
                    title="🎨 Generated Photo"
                    className="w-full"
                    onClickCard={() => {
                      console.log('Photo card clicked:', falState.response?.imageUrl)
                    }}
                  />

                  {/* Metadata Card */}
                  <Card
                    variant="info"
                    title="📋 Generation Details"
                    className="w-full">
                    <View className="space-y-2">
                      {falState.response.description && (
                        <View>
                          <Text className="text-sm font-semibold text-textPrimary">Description:</Text>
                          <Text className="text-base text-textSecondary">
                            {falState.response.description}
                          </Text>
                        </View>
                      )}

                      <View>
                        <Text className="text-sm font-semibold text-textPrimary">Request ID:</Text>
                        <Text className="text-sm text-textTertiary font-mono">
                          {falState.response.requestId}
                        </Text>
                      </View>

                      <View>
                        <Text className="text-sm font-semibold text-textPrimary">File Details:</Text>
                        <Text className="text-sm text-textTertiary">
                          {falState.response.fileName} • {falState.response.contentType}
                        </Text>
                      </View>

                      <View>
                        <Text className="text-sm font-semibold text-textPrimary">Image URL:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                          <Text className="text-sm text-textTertiary font-mono">
                            {falState.response.imageUrl}
                          </Text>
                        </ScrollView>
                      </View>
                    </View>
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

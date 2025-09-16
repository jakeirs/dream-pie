import React from 'react'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import { useAppStores } from '@/stores'
import { Button, Icon, ICON_FAMILY_NAME } from '@/components/ui'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function ResultPage() {
  const { result, navigation, actions } = useAppStores()
  const { viewingResult } = result

  if (!viewingResult) {
    // If no result to view, go back to create
    router.replace('/(tabs)/index')
    return null
  }

  const handleSaveToGallery = async () => {
    try {
      await actions.completeCreation()
      // Show success message or navigate
    } catch (error) {
      console.error('Failed to save:', error)
    }
  }

  const handleSaveToPhotos = async () => {
    try {
      await result.saveToPhotos()
      // Show success toast
    } catch (error) {
      console.error('Failed to save to photos:', error)
    }
  }

  const handleShare = () => {
    navigation.openBottomSheet('shareOptions')
  }

  const handleGoBack = () => {
    if (result.resultSource === 'generation') {
      router.push('/(tabs)/index')
    } else {
      router.push('/(tabs)/explore') // Gallery
    }
  }

  const isNew = result.resultSource === 'generation'

  return (
    <View className="flex-1 bg-background">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>

        {/* Header Message */}
        <View className="px-6 pt-8 pb-4">
          <Text className="text-center text-lg text-textSecondary">
            {isNew ? "And just like that..." : "Your creation"} ✨
          </Text>
        </View>

        {/* Main Result Image */}
        <View className="px-6 mb-6">
          <View className="bg-card rounded-2xl overflow-hidden">
            <Image
              source={typeof viewingResult.resultImage === 'string'
                ? { uri: viewingResult.resultImage }
                : viewingResult.resultImage}
              className="w-full aspect-[3/4]"
              resizeMode="cover"
            />

            {/* Before/After Toggle */}
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm text-textSecondary">
                  {viewingResult.selectedPose.name} • {viewingResult.selectedPose.category}
                </Text>
                <TouchableOpacity
                  onPress={result.toggleBeforeAfter}
                  className="flex-row items-center bg-cardSecondary px-3 py-2 rounded-lg">
                  <Icon
                    family={ICON_FAMILY_NAME.Feather}
                    name={result.showBeforeAfter ? "eye-off" : "eye"}
                    size={16}
                    color={brandColors.textSecondary}
                  />
                  <Text className="text-xs text-textSecondary ml-2">
                    {result.showBeforeAfter ? "Hide Original" : "Show Original"}
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Before/After Comparison */}
              {result.showBeforeAfter && (
                <View className="flex-row space-x-3 mb-4">
                  <View className="flex-1">
                    <Text className="text-xs text-textMuted mb-2 text-center">Before</Text>
                    <Image
                      source={{ uri: viewingResult.originalPhoto }}
                      className="w-full aspect-square rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-textMuted mb-2 text-center">After</Text>
                    <Image
                      source={typeof viewingResult.resultImage === 'string'
                        ? { uri: viewingResult.resultImage }
                        : viewingResult.resultImage}
                      className="w-full aspect-square rounded-lg"
                      resizeMode="cover"
                    />
                  </View>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View className="px-6 space-y-4">
          {/* Save to Photos */}
          <Button
            onPress={handleSaveToPhotos}
            variant="secondary"
            className="w-full flex-row items-center justify-center py-4"
            disabled={result.isSaving}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="download"
              size={20}
              color={brandColors.textPrimary}
            />
            <Text className="text-base font-medium text-textPrimary ml-3">
              {result.isSaving ? 'Saving...' : 'Save to Photos'}
            </Text>
          </Button>

          {/* Save to Gallery (only for new creations) */}
          {isNew && (
            <Button
              onPress={handleSaveToGallery}
              variant="accent"
              className="w-full flex-row items-center justify-center py-4">
              <Icon
                family={ICON_FAMILY_NAME.Feather}
                name="bookmark"
                size={20}
                color="white"
              />
              <Text className="text-base font-medium text-white ml-3">
                Save to My Gallery
              </Text>
            </Button>
          )}

          {/* Social Sharing */}
          <View className="bg-card rounded-xl p-4">
            <Text className="text-base font-semibold text-textPrimary mb-4 text-center">
              Spread the Magic!
            </Text>

            <View className="flex-row justify-center space-x-6 mb-4">
              <TouchableOpacity className="items-center" onPress={handleShare}>
                <View className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl items-center justify-center mb-2">
                  <Text className="text-xl">📷</Text>
                </View>
                <Text className="text-xs text-textSecondary">Stories</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={handleShare}>
                <View className="w-12 h-12 bg-black rounded-xl items-center justify-center mb-2">
                  <Text className="text-xl">🎵</Text>
                </View>
                <Text className="text-xs text-textSecondary">TikTok</Text>
              </TouchableOpacity>

              <TouchableOpacity className="items-center" onPress={handleShare}>
                <View className="w-12 h-12 bg-blue-500 rounded-xl items-center justify-center mb-2">
                  <Text className="text-xl">📤</Text>
                </View>
                <Text className="text-xs text-textSecondary">More Apps</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Fixed Bottom Action */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-borderLight">
        <View className="px-6 py-6">
          <Button
            onPress={handleShare}
            style={{ backgroundColor: brandColors.primary }}
            className="w-full py-4">
            <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
              Share!
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}
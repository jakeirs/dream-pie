import React from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Button, PageHeader, ICON_FAMILY_NAME } from '@/components/ui'
import { useAppStores } from '@/stores'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function CreatePage() {
  const { pose, photo, subscription, navigation } = useAppStores()

  const handlePoseChange = () => {
    navigation.openBottomSheet('poseLibrary')
  }

  const handlePhotoChange = () => {
    // In real app, this would open camera/gallery picker
    photo.setPhoto(require('@/assets/selfies/extend-photo.jpeg'))
    navigation.openBottomSheet('selfieGuide')
  }

  const handleCreatePhotoshoot = async () => {
    // Check subscription limits
    if (!subscription.canCreateMore()) {
      navigation.openBottomSheet('paywall')
      return
    }

    // Validate inputs
    if (!pose.selectedPose) {
      navigation.openBottomSheet('poseLibrary')
      return
    }

    if (!photo.selectedPhoto) {
      handlePhotoChange()
      return
    }

    // Use credit and start generation
    if (subscription.useCredit()) {
      router.push('/(creation)/generation')
    }
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="Dream Pie"
        rightIcon={{
          name: 'settings',
          family: ICON_FAMILY_NAME.Feather,
          onPress: () => navigation.openBottomSheet('settings')
        }}
      />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>

        {/* Main Header */}
        <View className="px-6 pt-8 pb-8">
          <Text className="text-3xl font-bold text-textPrimary text-center mb-4">
            Let's create something new!
          </Text>
        </View>

        {/* Pose Selection Card */}
        <View className="px-6 mb-6">
          <TouchableOpacity
            onPress={handlePoseChange}
            className="bg-card rounded-2xl p-4 border border-borderLight"
            style={{ minHeight: 180 }}>

            {pose.selectedPose ? (
              <>
                <Image
                  source={pose.selectedPose.imageUrl}
                  className="w-full h-32 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-textSecondary">Selected Pose</Text>
                  <Button
                    variant="warning"
                    size="small"
                    onPress={handlePoseChange}>
                    Change
                  </Button>
                </View>
              </>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-lg font-semibold text-textPrimary mb-2">
                  Select a Pose
                </Text>
                <Text className="text-textSecondary text-center mb-4">
                  Choose from our professional pose library
                </Text>
                <Button variant="secondary" onPress={handlePoseChange}>
                  Browse Poses
                </Button>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Photo Selection Card */}
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handlePhotoChange}
            className="bg-card rounded-2xl p-4 border border-borderLight"
            style={{ minHeight: 180 }}>

            {photo.selectedPhoto ? (
              <>
                <Image
                  source={{ uri: photo.selectedPhoto }}
                  className="w-full h-32 rounded-xl mb-3"
                  resizeMode="cover"
                />
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-textSecondary">Your Photo</Text>
                  <Button
                    variant="warning"
                    size="small"
                    onPress={handlePhotoChange}>
                    Change
                  </Button>
                </View>
              </>
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-lg font-semibold text-textPrimary mb-2">
                  Add Your Photo
                </Text>
                <Text className="text-textSecondary text-center mb-4">
                  Take a selfie or choose from gallery
                </Text>
                <Button variant="secondary" onPress={handlePhotoChange}>
                  Add Photo
                </Button>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Credits Info */}
        <View className="px-6 mb-8">
          <View className="bg-cardSecondary rounded-xl p-4">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-sm font-medium text-textPrimary">
                  Credits Remaining
                </Text>
                <Text className="text-xs text-textSecondary">
                  {subscription.subscription.tier === 'free' ? 'Free Plan' : 'Pro Plan'}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-2xl font-bold text-accent">
                  {subscription.getRemainingCredits()}
                </Text>
                <Text className="text-xs text-textSecondary">
                  of {subscription.subscription.creditsTotal}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Buy Premium Button */}
        {subscription.subscription.tier === 'free' && (
          <View className="px-6 mb-8">
            <Button
              onPress={() => navigation.openBottomSheet('paywall')}
              variant="success"
              className="w-full py-4">
              <Text className="text-lg font-bold text-white">
                🚀 Buy Premium - Unlimited Creations!
              </Text>
            </Button>
          </View>
        )}

      </ScrollView>

      {/* Fixed Create Button */}
      <View className="absolute bottom-0 left-0 right-0 bg-background border-t border-borderLight">
        <View className="px-6 py-6">
          <Button
            onPress={handleCreatePhotoshoot}
            className="w-full"
            style={{
              backgroundColor: brandColors.primary,
              paddingVertical: 18,
            }}
            disabled={!pose.selectedPose || !photo.selectedPhoto}>
            <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
              Create My Photoshoot
            </Text>
          </Button>
        </View>
      </View>
    </View>
  )
}

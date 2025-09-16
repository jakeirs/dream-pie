import React, { useCallback, useRef } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Button, PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui'
import { useAppStores } from '@/stores'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'
import BottomSheetLib, { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet'

// Import content components
import PoseLibraryContent from '@/components/PAGE/pose-library'
import PaywallContent from '@/components/PAGE/paywall'

export default function CreatePage() {
  const { pose, photo, subscription, generation } = useAppStores()

  // Local refs for modals
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  const handlePoseChange = () => {
    // poseLibraryRef.current?.present()
    poseLibraryRef.current?.expand()
  }

  const handlePhotoChange = () => {
    // In real app, this would open camera/gallery picker
    photo.setPhoto(require('@/assets/selfies/extend-photo.jpeg'))
  }

  const handleCreatePhotoshoot = async () => {
    // Check subscription limits
    if (!subscription.canCreateMore()) {
      paywallRef.current?.present()
      return
    }

    // Validate inputs
    if (!pose.selectedPose) {
      poseLibraryRef.current?.expand()
      return
    }

    if (!photo.selectedPhoto) {
      handlePhotoChange()
      return
    }

    // Use credit and start generation
    if (subscription.useCredit()) {
      // Start the generation process
      if (pose.selectedPose && photo.selectedPhoto) {
        await generation.startGeneration(
          pose.selectedPose.id,
          pose.selectedPose.name,
          pose.selectedPose.category,
          photo.selectedPhoto
        )
        router.push('/(creation)/generation')
      }
    }
  }

  const handleSettingsPress = () => {
    router.push('/settings')
  }
  const handlePaywallOpen = () => {
    paywallRef.current?.present()
  }

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="Dream Pie"
        rightIcon={{
          name: 'settings',
          family: ICON_FAMILY_NAME.Feather,
          onPress: handleSettingsPress,
        }}
      />
      {/* Main Header */}
      <View className="px-6 pb-8 pt-8">
        <Text className="mb-4 text-center text-3xl font-bold text-textPrimary">
          Let's create something new!
        </Text>
      </View>

      {/* Credits Info */}
      <View className="mb-8 px-6">
        <View className="rounded-xl bg-cardSecondary p-4">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm font-medium text-textPrimary">Credits Remaining</Text>
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        {/* Buy Premium Button */}
        {subscription.subscription.tier === 'free' && (
          <View className="mb-8 px-6">
            <Button onPress={handlePaywallOpen} variant="success" className="w-full py-4">
              <Text className="text-lg font-bold text-white">
                🚀 Buy Premium - Unlimited Creations!
              </Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Fixed Create Button */}
      <View className="right-0 border-t border-borderLight bg-background">
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

      {/* Pose Library Button */}
      <View className="border-t border-borderLight bg-background">
        <View className="px-6 py-6">
          <Button
            onPress={handlePoseChange}
            className="w-full"
            style={{
              backgroundColor: brandColors.warning,
              paddingVertical: 18,
            }}>
            <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
              Choose Pose
            </Text>
          </Button>
        </View>
      </View>

      {/* Bottom Sheet Modals */}
      <BottomSheet
        ref={poseLibraryRef}
        isModal={false}
        enablePanDownToClose={false}
        scrollView={false}
        snapPoints={['30%', '60%', '95%']}
        backdropAppearsIndex={1}
        index={1}>
        <PoseLibraryContent onClose={() => poseLibraryRef.current?.close()} />
      </BottomSheet>

      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent onClose={() => paywallRef.current?.dismiss()} />
      </BottomSheet>
    </View>
  )
}

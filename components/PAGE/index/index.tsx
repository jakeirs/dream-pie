import React, { useRef } from 'react'
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import { Button, PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui'
import { useAppStores } from '@/stores'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'

// Import content components
import PoseLibraryContent from '@/components/PAGE/pose-library'
import SelfieGuideContent from '@/components/PAGE/selfie-guide'
import PaywallContent from '@/components/PAGE/paywall'

export default function CreatePage() {
  const { pose, photo, subscription, generation } = useAppStores()

  // Local refs for modals
  const poseLibraryRef = useRef<BottomSheetModal>(null)
  const selfieGuideRef = useRef<BottomSheetModal>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  const handlePoseChange = () => {
    poseLibraryRef.current?.present()
  }

  const handlePhotoChange = () => {
    // In real app, this would open camera/gallery picker
    photo.setPhoto(require('@/assets/selfies/extend-photo.jpeg'))
    selfieGuideRef.current?.present()
  }

  const handleCreatePhotoshoot = async () => {
    // Check subscription limits
    if (!subscription.canCreateMore()) {
      paywallRef.current?.present()
      return
    }

    // Validate inputs
    if (!pose.selectedPose) {
      poseLibraryRef.current?.present()
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

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        {/* Main Header */}
        <View className="px-6 pb-8 pt-8">
          <Text className="mb-4 text-center text-3xl font-bold text-textPrimary">
            Let's create something new!
          </Text>
        </View>

        {/* Pose Selection Card */}
        <View className="mb-6 px-6">
          <TouchableOpacity
            onPress={handlePoseChange}
            className="rounded-2xl border border-borderLight bg-card p-4"
            style={{ minHeight: 180 }}>
            {pose.selectedPose ? (
              <>
                <Image
                  source={pose.selectedPose.imageUrl}
                  className="mb-3 h-32 w-full rounded-xl"
                  resizeMode="cover"
                />
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-textSecondary">Selected Pose</Text>
                  <Button variant="warning" size="small" onPress={handlePoseChange}>
                    <Text>Change</Text>
                  </Button>
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="mb-2 text-lg font-semibold text-textPrimary">Select a Pose</Text>
                <Text className="mb-4 text-center text-textSecondary">
                  Choose from our professional pose library
                </Text>
                <Button variant="secondary" onPress={handlePoseChange}>
                  <Text>Browse Poses</Text>
                </Button>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Photo Selection Card */}
        <View className="mb-8 px-6">
          <TouchableOpacity
            onPress={handlePhotoChange}
            className="rounded-2xl border border-borderLight bg-card p-4"
            style={{ minHeight: 180 }}>
            {photo.selectedPhoto ? (
              <>
                <Image
                  source={{ uri: photo.selectedPhoto }}
                  className="mb-3 h-32 w-full rounded-xl"
                  resizeMode="cover"
                />
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm text-textSecondary">Your Photo</Text>
                  <Button variant="warning" size="small" onPress={handlePhotoChange}>
                    <Text>Change</Text>
                  </Button>
                </View>
              </>
            ) : (
              <View className="flex-1 items-center justify-center">
                <Text className="mb-2 text-lg font-semibold text-textPrimary">Add Your Photo</Text>
                <Text className="mb-4 text-center text-textSecondary">
                  Take a selfie or choose from gallery
                </Text>
                <Button variant="secondary" onPress={handlePhotoChange}>
                  <Text>Add Photo</Text>
                </Button>
              </View>
            )}
          </TouchableOpacity>
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

        {/* Buy Premium Button */}
        {subscription.subscription.tier === 'free' && (
          <View className="mb-8 px-6">
            <Button
              onPress={() => {
                console.log('subscription', subscription)

                paywallRef.current?.present()
              }}
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
      <View className="absolute bottom-0 left-0 right-0 border-t border-borderLight bg-background">
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

      {/* Bottom Sheet Modals */}
      <BottomSheet ref={poseLibraryRef} isModal={true} scrollView={true}>
        <PoseLibraryContent onClose={() => poseLibraryRef.current?.dismiss()} />
      </BottomSheet>

      <BottomSheet ref={selfieGuideRef} isModal={true} scrollView={true}>
        <SelfieGuideContent onClose={() => selfieGuideRef.current?.dismiss()} />
      </BottomSheet>

      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent
          onClose={() => {
            console.log('Paywall onClose called')
            paywallRef.current?.dismiss()
            paywallRef.current?.close()
          }}
        />
      </BottomSheet>
    </View>
  )
}

import { View, Text, ScrollView } from 'react-native'
import { Button, PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui'
import { useState } from 'react'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'
import { mockSubscriptions } from '@/mockData/dream'
import { useBottomSheets } from './useBottomSheets'

// Import content components
import PoseLibraryContent from '@/components/PAGE/pose-library'
import PaywallContent from '@/components/PAGE/paywall'

export default function CreatePage() {
  const [subscription] = useState(mockSubscriptions[0]) // Free tier

  // Bottom Sheet management
  const {
    poseLibraryRef,
    paywallRef,
    handlePoseLibraryOpen,
    handlePoseLibraryClose,
    handlePaywallOpen,
    handlePaywallClose,
  } = useBottomSheets()

  const handlePoseChange = () => {
    handlePoseLibraryOpen()
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
                {subscription.tier === 'free' ? 'Free Plan' : 'Pro Plan'}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-bold text-accent">
                {subscription.creditsTotal - subscription.creditsUsed}
              </Text>
              <Text className="text-xs text-textSecondary">of {subscription.creditsTotal}</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}>
        {/* Generate Photo Button */}
        <View className="mb-8 px-6">
          <Button
            onPress={() => router.push('/(creation)/generation')}
            className="w-full"
            style={{
              backgroundColor: brandColors.success,
              paddingVertical: 24,
            }}>
            <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
              🎨 Generate Photo →
            </Text>
          </Button>
        </View>

        {/* Buy Premium Button */}
        {subscription.tier === 'free' && (
          <View className="mb-8 px-6">
            <Button onPress={handlePaywallOpen} variant="success" className="w-full py-4">
              <Text className="text-lg font-bold text-white">
                🚀 Buy Premium - Unlimited Creations!
              </Text>
            </Button>
          </View>
        )}
      </ScrollView>

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
        <PoseLibraryContent onClose={handlePoseLibraryClose} />
      </BottomSheet>

      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent onClose={handlePaywallClose} />
      </BottomSheet>
    </View>
  )
}

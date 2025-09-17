import React, { useRef } from 'react'
import { View, Text } from 'react-native'
import Button from '@/components/ui/Button/Button'
import BottomSheet from '@/components/ui/BottomSheet/BottomSheet'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import PaywallContent from '@/components/PAGE/paywall'

export default function LoginPage() {
  const paywallRef = useRef<BottomSheetModal>(null)

  const handleLoginAsUser = () => {
    router.push('/(tabs)')
  }

  const handleShowPaywall = () => {
    paywallRef.current?.present()
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
            <Text
              className="text-xl font-bold"
              style={{ color: brandColors.primaryForeground }}>
              Login as User → Go to Main App
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
            <Text className="text-xl font-bold text-white">
              🚀 Show Paywall Modal
            </Text>
          </Button>
        </View>
      </View>

      {/* Paywall Modal */}
      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent onClose={() => paywallRef.current?.dismiss()} />
      </BottomSheet>
    </View>
  )
}
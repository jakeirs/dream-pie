import { View, Text, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import Button from '@/components/ui/Button/Button'
import { appAssets } from '@/shared/assets/assets'

export function OnboardingStep3Page() {
  const handleGetStarted = () => {
    router.push('/(auth)/login')
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={appAssets.posesSitting.bakeryHeadBothHands}
        className="h-full w-full flex-1"
        resizeMode="cover">
        <View className="flex-1 justify-end">
          <View className="relative">
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.8)', '#FFFFFF']}
              locations={[0, 0.25, 1]}
              className="absolute bottom-0 left-0 right-0 top-0"
            />

            <View className="px-6 pb-6 pt-24">
              <View className="mb-8">
                <Text className="text-lg text-textPrimary">No endless photoshoots.</Text>
                <Text className="text-lg text-textPrimary">One selfie is enough</Text>

                <Text className="text-4xl font-bold leading-tight text-textPrimary">
                  Fill your Instagram with photos they can’t ignore
                </Text>
              </View>

              <Button
                variant="primary"
                onPress={handleGetStarted}
                className="mb-4 w-full"
                title="Continue"
                size="lg"
              />
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

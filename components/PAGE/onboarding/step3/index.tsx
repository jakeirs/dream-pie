import { View, Text, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import Button from '@/components/ui/Button/Button'

export function OnboardingStep3Page() {
  const handleGetStarted = () => {
    router.push('/(auth)/login')
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={require('@/assets/poses/poses-selfie/pose-selfie-outside-nature-golden-h-look-up-from-bottom.jpg')}
        className="h-full w-full flex-1"
        resizeMode="cover">
        <View className="flex-1 justify-end">
          <View className="relative">
            <LinearGradient
              colors={['transparent', 'rgba(255, 255, 255, 0.8)', '#FFFFFF']}
              locations={[0, 0.4, 1]}
              className="absolute bottom-0 left-0 right-0 top-0"
            />

            <View className="px-6 pb-6 pt-36">
              <View className="mb-8">
                <Text className="mb-2 text-center text-4xl font-bold leading-none text-textPrimary">
                  Welcome to
                </Text>
                <Text className="mb-4 text-center text-4xl font-bold leading-[1] text-[#8B5CF6]">
                  Dream Pie®
                </Text>
                <Text className="text-center text-lg leading-none text-textSecondary">
                  Turn your selfies into Insta-worthy photos
                </Text>
              </View>

              <Button
                variant="primary"
                onPress={handleGetStarted}
                className="mb-4 w-full"
                title="Get Started"
              />

              <Text className="text-center text-sm text-textMuted">
                By continuing, you agree to our{' '}
                <Text className="font-semibold text-textSecondary">Privacy Policy</Text> and{' '}
                <Text className="font-semibold text-textSecondary">Terms of Service</Text>
              </Text>
            </View>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

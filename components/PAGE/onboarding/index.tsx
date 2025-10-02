import { View, Text, ImageBackground } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { router } from 'expo-router'

import Button from '@/components/ui/Button/Button'

export default function OnboardingPage() {
  const handleGetStarted = () => {
    router.push('/(tabs)')
  }

  return (
    <View className="flex-1">
      <ImageBackground
        source={require('@/assets/poses/poses-selfie/pose-selfie-outside-nature-golden-h-look-up-from-bottom.jpg')}
        className="h-full w-full flex-1"
        resizeMode="cover">
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.8)', '#FFFFFF']}
          locations={[0, 0.6, 1]}
          className="flex-1">
          <View className="flex-1 justify-end px-6 pb-12">
            <View className="mb-8">
              <Text className="mb-2 text-center text-4xl font-bold text-textPrimary">
                Welcome to
              </Text>
              <Text className="mb-4 text-center text-4xl font-bold text-[#8B5CF6]">
                Dream Pie®
              </Text>
              <Text className="text-center text-lg text-textSecondary">
                Create stunning AI-generated photos
              </Text>
            </View>

            <Button variant="primary" onPress={handleGetStarted} className="mb-4 w-full" title="Get Started" />

            <Text className="text-center text-sm text-textMuted">
              By continuing, you agree to our{' '}
              <Text className="font-semibold text-textSecondary">Privacy Policy</Text> and{' '}
              <Text className="font-semibold text-textSecondary">Terms of Service</Text>
            </Text>
          </View>
        </LinearGradient>
      </ImageBackground>
    </View>
  )
}

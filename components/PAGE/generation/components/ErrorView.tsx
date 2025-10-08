import { View, Text, ScrollView } from 'react-native'
import { router } from 'expo-router'
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated'

import Button from '@/components/ui/Button/Button'
import PhotoThumbnail from '@/components/ui/PhotoThumbnail/PhotoThumbnail'
import { GradientIcon } from '@/components/ui/icons/GradientIcon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

import { useStore, usePhotoGenerationStore } from '@/stores'
import { brandColors } from '@/shared/theme'

interface ErrorViewProps {
  error: string | null
}

interface SolutionStep {
  icon: string
  title: string
  description: string
  gradientColors: [string, string]
}

const solutionSteps: SolutionStep[] = [
  {
    icon: 'image-outline',
    title: 'Use Different Photo',
    description: 'Try selecting another selfie from your gallery',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
  {
    icon: 'shield-checkmark-outline',
    title: 'Follow Guidelines',
    description: 'Ensure your photo follows our content policy (no nudity)',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
  {
    icon: 'time-outline',
    title: 'Try Later',
    description: 'Our server might be temporarily overloaded, or try with different pose',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
]

export default function ErrorView({ error }: ErrorViewProps) {
  const usedSelfie = useStore(usePhotoGenerationStore, (state) => state.usedSelfie)
  const usedPose = useStore(usePhotoGenerationStore, (state) => state.usedPose)
  const photoGeneration = usePhotoGenerationStore()

  const handleTryAgain = () => {
    // Reset error state
    photoGeneration.setError('')
    photoGeneration.reset()

    // Navigate back to index page
    setTimeout(() => {
      router.push('/(tabs)')
    }, 100)
  }

  return (
    <View className="absolute inset-0 bg-background">
      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Used Selfie and Pose */}
        {(usedSelfie || usedPose) && (
          <Animated.View entering={FadeIn.duration(300)} className="mb-6 mt-8">
            <Text
              className="mb-3 px-6 text-sm font-semibold"
              style={{ color: brandColors.textSecondary }}>
              Photos Used
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, gap: 12 }}>
              {usedSelfie && (
                <View>
                  <PhotoThumbnail imageUri={usedSelfie.imageUrl} />
                  <Text
                    className="mt-2 text-center text-xs"
                    style={{ color: brandColors.textSecondary }}>
                    Your Selfie
                  </Text>
                </View>
              )}
              {usedPose && (
                <View>
                  <PhotoThumbnail imageUri={usedPose.imageUrl} />
                  <Text
                    className="mt-2 text-center text-xs"
                    style={{ color: brandColors.textSecondary }}>
                    Selected Pose
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        )}

        {/* Error Icon */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="items-center py-8">
          <GradientIcon
            family={ICON_FAMILY_NAME.Ionicons}
            name="alert-circle-outline"
            size={100}
            gradientColors={['#FF453A', '#FF9500']}
            gradientId="gradient-error-icon"
          />
          <Text className="mt-4 text-2xl font-bold" style={{ color: brandColors.textPrimary }}>
            Generation Failed
          </Text>
          {error && (
            <Text
              className="mt-2 px-8 text-center text-sm font-light"
              style={{ color: brandColors.textSecondary }}>
              {error}
            </Text>
          )}
        </Animated.View>

        {/* Solution Steps */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} className="mb-8 px-8">
          <Text
            className="mb-4 text-center text-base font-semibold"
            style={{ color: brandColors.textPrimary }}>
            Here's what you can try:
          </Text>
          {solutionSteps.map((step, index) => (
            <View key={index} className="mb-4 flex-row">
              <View className="mr-4">
                <GradientIcon
                  family={ICON_FAMILY_NAME.Ionicons}
                  name={step.icon}
                  size={24}
                  gradientColors={step.gradientColors}
                  gradientId={`gradient-solution-${index}`}
                />
              </View>
              <View className="flex-1">
                <Text
                  className="mb-1 text-base font-semibold"
                  style={{ color: brandColors.textPrimary }}>
                  {step.title}
                </Text>
                <Text className="text-sm font-light" style={{ color: brandColors.textSecondary }}>
                  {step.description}
                </Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Try Again Button */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="px-8">
          <Button
            title="Try Again"
            variant="primaryForeground"
            size="lg"
            icon={{
              family: ICON_FAMILY_NAME.Ionicons,
              name: 'refresh-outline',
              position: 'left',
            }}
            onPress={handleTryAgain}
          />
        </Animated.View>
      </ScrollView>
    </View>
  )
}

import { View, Text } from 'react-native'
import { router } from 'expo-router'

import Button from '@/components/ui/Button/Button'
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
    description: 'Ensure your photo follows our content policy (no nudity, proper selfie photo)',
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
  const handleTryAgain = () => {
    router.replace('/(tabs)')
  }

  return (
    <View className="absolute inset-0 bg-background">
      <View className="flex-1">
        {/* Used Selfie and Pose */}
        {/* Error Icon */}
        <View className="items-center py-8">
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
        </View>

        {/* Solution Steps */}
        <View className="mb-8 px-8">
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
        </View>

        {/* Try Again Button */}
        <View className="px-8">
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
        </View>
      </View>
    </View>
  )
}

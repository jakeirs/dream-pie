import { View, Text } from 'react-native'

import { GradientIcon } from '@/components/ui/icons/GradientIcon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'

interface Step {
  icon: string
  title: string
  gradientColors: [string, string]
}

const steps: Step[] = [
  {
    icon: 'image-outline',
    title: 'Upload your best selfie. Click "Change"',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
  {
    icon: 'walk-outline',
    title: 'Pick your dream pose. Click "Change"',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
  {
    icon: 'sparkles',
    title: 'Watch AI bring it to life',
    gradientColors: ['#A78BFA', '#EC4899'],
  },
]

export default function HowItWorks() {
  return (
    <View className="mb-8 px-8">
      {steps.map((step, index) => (
        <View key={index} className="my-2 mb-1 flex-row items-center">
          <View className="mr-4">
            <GradientIcon
              family={ICON_FAMILY_NAME.Ionicons}
              name={step.icon}
              size={24}
              gradientColors={step.gradientColors}
              gradientId={`gradient-${index}`}
            />
          </View>
          <View className="">
            <View className="mb-1 flex-row items-center">
              <Text className="font-light text-textSecondary">{step.title}</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  )
}

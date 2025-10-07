import { View, Text } from 'react-native'

import { GradientIcon } from '@/components/ui/icons/GradientIcon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'

interface Step {
  number: string
  icon: string
  title: string
  description: string
  gradientColors: [string, string]
}

const steps: Step[] = [
  {
    number: '1️⃣',
    icon: 'image-outline',
    title: 'Upload your best selfie',
    description: 'Show your true vibe.',
    gradientColors: ['#FF6B9D', '#FEC163'],
  },
  {
    number: '2️⃣',
    icon: 'walk-outline',
    title: 'Pick your dream pose',
    description: "Choose the look you'd love to see yourself in.",
    gradientColors: ['#A78BFA', '#EC4899'],
  },
  {
    number: '3️⃣',
    icon: 'sparkles',
    title: 'Watch AI bring it to life',
    description: 'Your photoshoot, reimagined.',
    gradientColors: ['#3B82F6', '#8B5CF6'],
  },
]

export default function HowItWorks() {
  return (
    <View className="mb-6 px-8">
      {steps.map((step, index) => (
        <View key={index} className="mb-1 flex-row items-center">
          <View className="mr-4">
            <GradientIcon
              family={ICON_FAMILY_NAME.Ionicons}
              name={step.icon}
              size={19}
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

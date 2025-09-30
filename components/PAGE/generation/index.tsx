import { View, Text } from 'react-native'
import { router } from 'expo-router'

import PixelatedEffect from './components/PixelatedEffect'

import Button from '@/components/ui/Button/Button'
import { brandColors } from '@/shared/theme'

export default function GenerationPage() {
  const handleNext = () => {
    router.push('/(creation)/result')
  }

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <PixelatedEffect />
      </View>

      {/* <View className="absolute bottom-8 left-0 right-0 px-6">
        <Button
          onPress={handleNext}
          className="w-full"
          style={{
            backgroundColor: brandColors.primary,
            paddingVertical: 24,
          }}>
          <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
            View Result →
          </Text>
        </Button>
      </View> */}
    </View>
  )
}

import { View, Text } from 'react-native'
import { router } from 'expo-router'

import PixelatedEffect from './components/PixelatedEffect'

import { useInformationAnimation } from './hooks/useInformationAnimation'
import { INFORMATION_CONFIG } from './config/informationConfig'

import Button from '@/components/ui/Button/Button'
import InformationBubble from '@/components/ui/InformationBubble/InformationBubble'
import { brandColors } from '@/shared/theme'

export default function GenerationPage() {
  const handleNext = () => {
    router.push('/(creation)/result')
  }

  const {
    currentMessage,
    isVisible,
    x,
    y,
    bubbleWidth,
    bubbleHeight,
    repulsionPadding,
    repulsionStrength,
  } = useInformationAnimation()

  return (
    <View className="flex-1 bg-background">
      <View className="flex-1">
        <PixelatedEffect
          bubbleX={x}
          bubbleY={y}
          bubbleWidth={bubbleWidth}
          bubbleHeight={bubbleHeight}
          repulsionPadding={repulsionPadding}
          repulsionStrength={repulsionStrength}
          isBubbleVisible={isVisible}
        />

        <InformationBubble
          message={currentMessage}
          visible={isVisible}
          x={x}
          y={y}
          fadeInDuration={INFORMATION_CONFIG.FADE_IN_DURATION}
          fadeOutDuration={INFORMATION_CONFIG.FADE_OUT_DURATION}
        />
      </View>

      <View className="absolute bottom-8 left-0 right-0 px-6">
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
      </View>
    </View>
  )
}

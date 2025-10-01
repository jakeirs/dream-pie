import { Text } from 'react-native'

import Animated, { FadeIn, FadeOut, SharedValue, useAnimatedStyle } from 'react-native-reanimated'

import { brandColors } from '@/shared/theme'

interface InformationBubbleProps {
  message: string
  visible: boolean
  x: SharedValue<number>
  y: SharedValue<number>
  fadeInDuration?: number
  fadeOutDuration?: number
}

export default function InformationBubble({
  message,
  visible,
  x,
  y,
  fadeInDuration = 300,
  fadeOutDuration = 300,
}: InformationBubbleProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: x.get() }, { translateY: y.get() }],
    }
  }, [x, y])

  if (!visible) return null

  return (
    <Animated.View
      entering={FadeIn.duration(fadeInDuration)}
      exiting={FadeOut.duration(fadeOutDuration)}
      style={[
        animatedStyle,
        {
          position: 'absolute',
          backgroundColor: `${brandColors.background}EE`,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          maxWidth: 280,
        },
      ]}
      pointerEvents="none">
      <Text
        style={{
          color: brandColors.textPrimary,
          fontSize: 16,
          fontWeight: '600',
        }}>
        {message}
      </Text>
    </Animated.View>
  )
}

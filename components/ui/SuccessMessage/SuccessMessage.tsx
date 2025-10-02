import { useEffect } from 'react'
import { Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated'

import { SuccessMessageProps } from './types'
import { brandColors } from '@/shared/theme'

export default function SuccessMessage({
  message,
  visible,
  duration = 2500,
  onDismiss,
}: SuccessMessageProps) {
  const opacity = useSharedValue(0)
  const scale = useSharedValue(0.8)
  const translateY = useSharedValue(-20)

  useEffect(() => {
    if (visible) {
      // Entrance animation
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) })
      scale.value = withSpring(1, { damping: 12, stiffness: 150 })
      translateY.value = withSpring(0, { damping: 15, stiffness: 120 })

      // Auto-dismiss after duration
      const timer = setTimeout(() => {
        // opacity.value = withTiming(0, { duration: 400, easing: Easing.in(Easing.ease) })
        // translateY.value = withTiming(-10, { duration: 400, easing: Easing.in(Easing.ease) })
        // onDismiss?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [visible, duration, onDismiss])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }))

  if (!visible) return null

  return (
    <Animated.View style={[animatedStyle]}>
      <Animated.View
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          paddingHorizontal: 24,
          paddingVertical: 16,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: brandColors.primary,
          shadowColor: brandColors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}>
        <Text
          style={{
            color: 'white',
            fontSize: 18,
            fontWeight: '700',
            textAlign: 'center',
          }}>
          {message}
        </Text>
      </Animated.View>
    </Animated.View>
  )
}

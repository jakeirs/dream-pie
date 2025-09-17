import { useSharedValue } from 'react-native-reanimated'
import { withSpring, withSequence, withTiming } from 'react-native-reanimated'

export const usePhotoCardAnimation = () => {
  const cardScale = useSharedValue(1)
  const buttonScale = useSharedValue(1)

  const animateCardPress = () => {
    // Card press animation
    cardScale.value = withSequence(
      withSpring(0.95, { damping: 15, stiffness: 300 }),
      withSpring(1.02, { damping: 15, stiffness: 300 }),
      withTiming(1, { duration: 100 })
    )

    // Button animation triggered by card press
    buttonScale.value = withSequence(
      withSpring(0.9, { damping: 15, stiffness: 300 }),
      withSpring(1.1, { damping: 15, stiffness: 300 }),
      withTiming(1, { duration: 100 })
    )
  }

  const animateCardPressIn = () => {
    cardScale.value = withSpring(0.98, { damping: 15, stiffness: 300 })
    buttonScale.value = withSpring(0.95, { damping: 15, stiffness: 300 })
  }

  const animateCardPressOut = () => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 300 })
    buttonScale.value = withSpring(1, { damping: 15, stiffness: 300 })
  }

  return {
    cardScale,
    buttonScale,
    animateCardPress,
    animateCardPressIn,
    animateCardPressOut,
  }
}
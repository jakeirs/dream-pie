import { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated'
import { Gesture } from 'react-native-gesture-handler'

import type { Gesture as GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'

interface UseZoomablePhotoParams {
  maxScale?: number
  minScale?: number
  scaleFromCenter?: boolean
  onZoomStart?: () => void
  onZoomEnd?: () => void
  gestureRef?: React.MutableRefObject<GestureType | undefined>
}

export const useZoomablePhoto = ({
  maxScale = 3,
  minScale = 1,
  scaleFromCenter = true,
  onZoomStart,
  onZoomEnd,
  gestureRef,
}: UseZoomablePhotoParams) => {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const containerHeight = useSharedValue(0)
  const iconOpacity = useSharedValue(1)

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      iconOpacity.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) })
      onZoomStart?.()
    })
    .onUpdate((event) => {
      const newScale = savedScale.value * event.scale
      scale.value = Math.max(minScale, Math.min(newScale, maxScale))
    })
    .onEnd(() => {
      scale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      translateX.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) })
      translateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) })
      iconOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) })
      savedScale.value = 1

      onZoomEnd?.()
    })

  // Assign gesture to ref if provided (for external gesture coordination)
  if (gestureRef) {
    gestureRef.current = pinchGesture
  }

  const animatedStyle = useAnimatedStyle(() => {
    const scaleOffset =
      !scaleFromCenter && containerHeight.value > 0
        ? ((scale.value - 1) * containerHeight.value) / 2
        : 0

    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + scaleOffset },
        { scale: scale.value },
      ],
    }
  })

  const iconAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: iconOpacity.value,
    }
  })

  return {
    pinchGesture,
    animatedStyle,
    iconAnimatedStyle,
    containerHeight,
  }
}

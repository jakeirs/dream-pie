import { View } from 'react-native'
import { Image } from 'expo-image'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { Icon, ICON_FAMILY_NAME } from '../icons'

import { brandColors } from '@/shared/theme'
import { ZoomablePhotoProps } from './types'

const ZoomablePhoto = ({
  imageSource,
  maxScale = 3,
  minScale = 1,
  contentFit = 'cover',
  contentPosition = 'center',
  scaleFromCenter = true,
  onZoomStart,
  onZoomEnd,
  onLoad,
  onError,
  className = '',
}: ZoomablePhotoProps) => {
  const scale = useSharedValue(1)
  const savedScale = useSharedValue(1)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const containerHeight = useSharedValue(0)

  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
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
      savedScale.value = 1

      onZoomEnd?.()
    })

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

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View
        className={`w-full h-full justify-center items-center relative ${className}`}
        onLayout={(event) => {
          containerHeight.value = event.nativeEvent.layout.height
        }}>
        <Animated.View style={animatedStyle} className="w-full h-full">
          <Image
            source={imageSource}
            style={{ width: '100%', height: '100%' }}
            contentFit={contentFit}
            contentPosition={contentPosition}
            onLoad={onLoad}
            onError={onError}
          />
        </Animated.View>
        <View className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-primary justify-center items-center pointer-events-none">
          <Icon
            family={ICON_FAMILY_NAME.MaterialIcons}
            name="pinch"
            size={24}
            color={brandColors.primaryForeground}
          />
        </View>
      </Animated.View>
    </GestureDetector>
  )
}

export default ZoomablePhoto

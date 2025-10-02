import { StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

import { ZoomablePhotoProps } from './types'

const ZoomablePhoto = ({
  imageSource,
  maxScale = 3,
  minScale = 1,
  contentFit = 'cover',
  contentPosition = 'center',
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

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }))

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View style={[styles.container]} className={className}>
        <Animated.View style={[styles.imageWrapper, animatedStyle]}>
          <Image
            source={imageSource}
            style={styles.image}
            contentFit={contentFit}
            contentPosition={contentPosition}
            onLoad={onLoad}
            onError={onError}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
})

export default ZoomablePhoto

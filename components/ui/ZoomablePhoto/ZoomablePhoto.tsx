import { Image } from 'expo-image'
import Animated from 'react-native-reanimated'
import { GestureDetector, NativeViewGestureHandler } from 'react-native-gesture-handler'

import { Icon, ICON_FAMILY_NAME } from '../icons'

import { useZoomablePhoto } from './hooks/useZoomablePhoto'

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
  const { pinchGesture, animatedStyle, iconAnimatedStyle, containerHeight } = useZoomablePhoto({
    maxScale,
    minScale,
    scaleFromCenter,
    onZoomStart,
    onZoomEnd,
  })

  return (
    <GestureDetector gesture={pinchGesture}>
      <Animated.View
        className={`relative h-full w-full items-center justify-center ${className}`}
        onLayout={(event) => {
          containerHeight.value = event.nativeEvent.layout.height
        }}>
        <Animated.View style={animatedStyle} className="h-full w-full">
          <Image
            source={imageSource}
            style={{ width: '100%', height: '100%' }}
            contentFit={contentFit}
            contentPosition={contentPosition}
            onLoad={onLoad}
            onError={onError}
          />
        </Animated.View>
        <Animated.View
          style={iconAnimatedStyle}
          className="pointer-events-none absolute bottom-4 left-4 h-12 w-12 items-center justify-center rounded-full bg-primary">
          <Icon
            family={ICON_FAMILY_NAME.MaterialIcons}
            name="pinch"
            size={24}
            color={brandColors.primaryForeground}
          />
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  )
}

export default ZoomablePhoto

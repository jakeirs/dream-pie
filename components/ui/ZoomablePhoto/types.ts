import { ImageContentFit, ImageContentPosition, ImageRef } from 'expo-image'
import { SharedValue } from 'react-native-reanimated'

import type { Gesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'

export interface ZoomablePhotoProps {
  imageSource: string | number | { uri: string } | ImageRef
  maxScale?: number
  minScale?: number
  contentFit?: ImageContentFit
  contentPosition?: ImageContentPosition
  scaleFromCenter?: boolean
  onZoomStart?: () => void
  onZoomEnd?: () => void
  onLoad?: () => void
  onError?: (error: { error: string }) => void
  className?: string
  gestureRef?: React.MutableRefObject<Gesture | undefined>
  scaleValue?: SharedValue<number>
}

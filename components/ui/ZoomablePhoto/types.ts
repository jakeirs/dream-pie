import { ImageContentFit, ImageContentPosition } from 'expo-image'

export interface ZoomablePhotoProps {
  imageSource: string | number | { uri: string }
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
}

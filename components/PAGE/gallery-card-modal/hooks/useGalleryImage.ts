import { useImage } from 'expo-image'
import { useSharedValue, useAnimatedStyle, withTiming, withDelay } from 'react-native-reanimated'

export const useGalleryImage = (imageUri: string) => {
  const image = useImage(imageUri)
  const thumbnailOpacity = useSharedValue(1)

  const imageAspectRatio = image ? image.width / image.height : 1

  const thumbnailAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: thumbnailOpacity.value,
    }
  })

  const handleZoomStart = () => {
    'worklet'
    thumbnailOpacity.value = withTiming(0, { duration: 50 })
  }

  const handleZoomEnd = () => {
    'worklet'
    thumbnailOpacity.value = withDelay(200, withTiming(1, { duration: 400 }))
  }

  return {
    image,
    imageAspectRatio,
    thumbnailAnimatedStyle,
    handleZoomStart,
    handleZoomEnd,
  }
}

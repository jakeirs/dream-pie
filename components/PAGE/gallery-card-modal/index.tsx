import { View, Text, StyleSheet } from 'react-native'
import { Image, useImage } from 'expo-image'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'

import ZoomablePhoto from '@/components/ui/ZoomablePhoto/ZoomablePhoto'
import PhotoThumbnail from '@/components/ui/PhotoThumbnail/PhotoThumbnail'

interface GalleryCardModalProps {
  imageUri: string
  title: string
  description?: string
  onClose: () => void
}

export default function GalleryCardModal({
  imageUri,
  title,
  description,
  onClose,
}: GalleryCardModalProps) {
  const image = useImage(imageUri)
  const thumbnailOpacity = useSharedValue(1)

  const imageAspectRatio = image ? image.width / image.height : 1

  // Animate thumbnail opacity based on zoom events
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

  return (
    <View className="flex-1 ">
      {/* Zoomable Image Container with dynamic aspectRatio and max height */}
      <View
        className="w-full items-center"
        style={{
          zIndex: 10,
        }}>
        {/* Blurred Background Layer - Full Width Behind Everything */}
        {image && (
          <View
            style={{
              ...StyleSheet.absoluteFillObject,
              maxHeight: 500,
            }}>
            <Image
              source={imageUri}
              style={{ width: '100%', height: '100%' }}
              contentFit="cover"
              blurRadius={100}
            />
          </View>
        )}
        <View
          style={{
            aspectRatio: imageAspectRatio,
            maxHeight: 500,
            width: '100%',
          }}>
          {/* Zoomable Photo on Top */}
          {image && (
            <ZoomablePhoto
              imageSource={image}
              scaleFromCenter={false}
              contentFit="contain"
              onZoomStart={handleZoomStart}
              onZoomEnd={handleZoomEnd}
            />
          )}
        </View>
      </View>

      <View className="items-end">
        {/* Photo Thumbnails Container - Overlapping the zoomable photo */}
        <Animated.View
          className="w-full max-w-80 flex-row justify-center gap-3  px-4"
          style={[
            {
              marginTop: -40,
              zIndex: 20,
            },
            thumbnailAnimatedStyle,
          ]}>
          <View style={{ flex: 1, maxWidth: 180 }}>
            <PhotoThumbnail imageUri={imageUri} />
          </View>
          <View style={{ flex: 1, maxWidth: 180 }}>
            <PhotoThumbnail imageUri={imageUri} />
          </View>
        </Animated.View>
        <Text className="mb-4 mt-2 text-lg font-medium text-white">{title}</Text>
      </View>

      {/* Content flows naturally below thumbnails */}
      <View className="flex-shrink"></View>
    </View>
  )
}

import { View, Text, StyleSheet, Alert } from 'react-native'
import { Image, useImage } from 'expo-image'
import * as Sharing from 'expo-sharing'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated'

import ZoomablePhoto from '@/components/ui/ZoomablePhoto/ZoomablePhoto'
import PhotoThumbnail from '@/components/ui/PhotoThumbnail/PhotoThumbnail'
import Button from '@/components/ui/Button/Button'

import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

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

  const handleShare = async () => {
    try {
      const isAvailable = await Sharing.isAvailableAsync()
      if (!isAvailable) {
        Alert.alert('Error', 'Sharing is not available on this device')
        return
      }

      await Sharing.shareAsync(imageUri, {
        dialogTitle: `Share ${title}`,
        mimeType: 'image/jpeg',
      })
    } catch (error) {
      Alert.alert('Error', 'Failed to share image')
      console.error('Share error:', error)
    }
  }

  return (
    <View className="min-h-full pb-6">
      <View className="relative min-h-full ">
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

        {/* Photo Thumbnails Container - Overlapping the zoomable photo */}
        <View className="flex-row items-end px-4" style={{ marginTop: -40 }}>
          <Text className="mt-2 text-lg font-medium leading-tight text-textLight">
            Used{'\n'}photos:
          </Text>
          <Animated.View
            className="w-full max-w-80 flex-row justify-center gap-3 px-4 "
            style={[
              {
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
        </View>
        {/* Content flows naturally below thumbnails */}
        <View
          className="mt-16 w-full flex-1  "
          style={{ borderTopLeftRadius: 44, borderTopRightRadius: 44 }}>
          <View className="flex-1 justify-center px-10 ">
            <Button
              title="Share"
              variant="primary"
              className="w-full"
              size="lg"
              icon={{
                family: ICON_FAMILY_NAME.FontAwesome,
                name: 'send',
                position: 'left',
              }}
              onPress={handleShare}
            />
          </View>
        </View>
      </View>
    </View>
  )
}

import { View, StyleSheet } from 'react-native'
import { Image, useImage } from 'expo-image'

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

  const imageAspectRatio = image ? image.width / image.height : 1

  return (
    <View className="flex-1 ">
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

      {/* Zoomable Image Container with dynamic aspectRatio and max height */}
      <View
        className="w-full items-center"
        style={{
          zIndex: 10,
        }}>
        <View
          style={{
            aspectRatio: imageAspectRatio,
            maxHeight: 500,
            width: '100%',
          }}>
          {/* Zoomable Photo on Top */}
          {image && (
            <ZoomablePhoto imageSource={image} scaleFromCenter={false} contentFit="contain" />
          )}
        </View>
      </View>

      {/* Photo Thumbnails Container - Overlapping the zoomable photo */}
      <View
        className="w-full max-w-80 flex-row justify-center gap-3 px-4"
        style={{
          marginTop: -40,
          zIndex: 20,
        }}>
        <View style={{ flex: 1, maxWidth: 180 }}>
          <PhotoThumbnail imageUri={imageUri} />
        </View>
        <View style={{ flex: 1, maxWidth: 180 }}>
          <PhotoThumbnail imageUri={imageUri} />
        </View>
      </View>

      {/* Content flows naturally below thumbnails */}
      <View className="flex-shrink"></View>
    </View>
  )
}

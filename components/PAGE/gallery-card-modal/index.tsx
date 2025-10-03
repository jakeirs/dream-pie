import { View, StyleSheet } from 'react-native'
import { Image, useImage } from 'expo-image'

import ZoomablePhoto from '@/components/ui/ZoomablePhoto/ZoomablePhoto'

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
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 500,
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

      {/* Content flows naturally below image */}
      <View className="flex-shrink"></View>
    </View>
  )
}

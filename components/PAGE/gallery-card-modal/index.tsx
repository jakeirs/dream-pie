import { View, Text } from 'react-native'
import { useImage } from 'expo-image'

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
    <View className="flex-1 py-4">
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

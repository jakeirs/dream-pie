import { Image, useImage } from 'expo-image'
import { View, Text } from 'react-native'

import { brandColors } from '@/shared/theme'

interface ResultPhotoProps {
  imageUrl: string
  width?: number
  height?: number
  className?: string
}

export default function ResultPhoto({
  imageUrl,
  width = 300,
  height = 200,
  className = ''
}: ResultPhotoProps) {
  const image = useImage(imageUrl)

  return (
    <View className={`relative overflow-hidden rounded-xl ${className}`}>
      {image ? (
        <Image
          source={image}
          style={{ width, height }}
          className="rounded-xl"
          contentFit="cover"
        />
      ) : (
        <View
          className="items-center justify-center rounded-xl"
          style={{
            width,
            height,
            backgroundColor: brandColors.cardSecondary
          }}>
          <Text className="text-textMuted">Loading image...</Text>
        </View>
      )}
    </View>
  )
}
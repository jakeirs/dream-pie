import { View } from 'react-native'
import { Image } from 'expo-image'

import { brandColors } from '@/shared/theme'

interface PhotoThumbnailProps {
  imageUri: string
}

export default function PhotoThumbnail({ imageUri }: PhotoThumbnailProps) {
  return (
    <View
      style={{
        borderWidth: 3,
        borderColor: brandColors.primary,
        borderRadius: 12,
        overflow: 'hidden',
        height: 160,
      }}>
      <Image source={imageUri} style={{ width: '100%', height: '100%' }} contentFit="cover" />
    </View>
  )
}

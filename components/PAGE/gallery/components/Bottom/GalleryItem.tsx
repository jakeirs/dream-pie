import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Image, useImage } from 'expo-image'

import { GalleryContent } from '@/types/dream/gallery'
import { DisplayData } from '../../hooks/useGallery'

interface GalleryItemProps {
  item: GalleryContent
  onPress: () => void
  displayData: DisplayData
}

export default function GalleryItem({ item, onPress, displayData }: GalleryItemProps) {
  const image = useImage(displayData.imageUri)
  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 48) / 2 // 2 columns with padding

  return (
    <TouchableOpacity
      onPress={onPress}
      className="mb-4"
      style={{ width: cardWidth }}>
      <View className="overflow-hidden rounded-xl bg-cardSecondary">
        {image && (
          <Image
            source={image}
            style={{
              width: '100%',
              height: 220,
            }}
            contentFit="cover"
          />
        )}
        <View className="p-3">
          <Text className="font-bold text-textPrimary" numberOfLines={1}>
            {displayData.title}
          </Text>
          <Text className="text-xs text-textSecondary" numberOfLines={2}>
            {displayData.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
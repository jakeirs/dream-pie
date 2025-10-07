import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import { Image } from 'expo-image'

import { DisplayData } from '../../hooks/useGallery'

interface GalleryItemProps {
  onPress: () => void
  displayData: DisplayData
}

export default function GalleryItem({ onPress, displayData }: GalleryItemProps) {
  return (
    <TouchableOpacity onPress={onPress} className="mx-1 mb-4">
      <View className="overflow-hidden rounded-xl bg-cardSecondary">
        {displayData.imageUri && (
          <Image
            source={displayData.imageUri}
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

import { View, Text } from 'react-native'
import { Image } from 'expo-image'
import { useStore } from 'zustand'
import { usePhotoGenerationStore } from '@/stores'

export default function CollagePreview() {
  const collageImageUri = useStore(usePhotoGenerationStore, (state) => state.collageImageUri)

  if (!collageImageUri) {
    return null
  }

  return (
    <View className="items-center space-y-4">
      {/* Preview Title */}
      <Text className="text-xl font-bold text-textPrimary">Your Dream Pie Collage</Text>

      {/* Generated Collage Preview */}
      <View className="rounded-lg bg-card p-4 shadow-md">
        <Image
          source={{ uri: collageImageUri }}
          style={{
            width: 300,
            height: 300,
            borderRadius: 12,
          }}
          contentFit="contain"
          placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        />
      </View>
    </View>
  )
}

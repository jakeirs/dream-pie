// 1. React Native Core & Expo
import { View, Text } from 'react-native'
// components
import PhotoCardGrid from './Top/PhotoCardGrid'

interface TopProps {}

export function Top({}: TopProps) {
  return (
    <View className="px-2 pb-3 pt-8">
      <Text className="mb-6 px-4 text-center text-3xl font-bold text-textPrimary">
        Create Insta-worthy Photo!
      </Text>

      <PhotoCardGrid />
    </View>
  )
}

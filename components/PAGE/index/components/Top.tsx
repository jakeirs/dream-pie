// 1. React Native Core & Expo
import { View, Text, ScrollView } from 'react-native'
// components
import PhotoCardGrid from './Top/PhotoCardGrid'

interface TopProps {}

export function Top({}: TopProps) {
  return (
    <View className="px-2 pb-8 pt-8">
      <Text className="mb-6 px-4 text-center text-3xl font-bold text-textPrimary">
        Let&apos;s create something new!
      </Text>

      <PhotoCardGrid />
    </View>
  )
}

import { View, Text } from 'react-native'
import PhotoCardGrid from './Top/PhotoCardGrid'

export function Top() {
  return (
    <View className="px-2 pb-8 pt-8">
      <Text className="mb-6 text-center text-3xl font-bold text-textPrimary px-4">
        Let's create something new!
      </Text>

      <PhotoCardGrid />
    </View>
  )
}

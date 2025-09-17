// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'

// 2. Same tree components (local to current page)
import PhotoCardGrid from './Top/PhotoCardGrid'

interface TopProps {
  onPosePress?: () => void
}

export function Top({ onPosePress }: TopProps) {
  return (
    <View className="px-2 pb-8 pt-8">
      <Text className="mb-6 text-center text-3xl font-bold text-textPrimary px-4">
        Let's create something new!
      </Text>

      <PhotoCardGrid onPosePress={onPosePress} />
    </View>
  )
}

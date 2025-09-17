import { View, Text } from 'react-native'
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

export function Top() {
  const handleChangePress = () => {
    console.log('Change photo pressed')
    // TODO: Implement photo selection functionality
  }

  return (
    <View className="px-6 pb-8 pt-8">
      <Text className="mb-6 text-center text-3xl font-bold text-textPrimary">
        Let's create something new!
      </Text>

      <PhotoCard
        onChangePress={handleChangePress}
        className="mx-auto max-w-xs"
      />
    </View>
  )
}

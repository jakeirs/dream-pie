import { View, Text } from 'react-native'

import { Pose } from '@/types'

interface PoseContentProps {
  item: Pose
}

export default function PoseContent({ item }: PoseContentProps) {
  return (
    <>
      <View className="mt-4 px-6">
        <Text className="text-center text-2xl font-bold text-textLight">{item.name}</Text>
        {item.description && (
          <Text className="mt-2 text-center text-base text-textSecondary">{item.description}</Text>
        )}
        <View className="mt-4 flex-row flex-wrap justify-center gap-2">
          {item.tags.map((tag, index) => (
            <View key={index} className="rounded-full bg-cardSecondary px-3 py-1">
              <Text className="text-sm text-textSecondary">#{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  )
}

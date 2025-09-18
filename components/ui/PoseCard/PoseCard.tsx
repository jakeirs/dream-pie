import { Image } from 'expo-image'

import { View, Text, Pressable } from 'react-native'

import { Pose } from '@/types/dream'

interface PoseCardProps {
  pose: Pose
  isSelected: boolean
  onSelect: (poseId: string) => void
}

export default function PoseCard({ pose, isSelected, onSelect }: PoseCardProps) {
  return (
    <Pressable onPress={() => onSelect(pose.id)}>
      <View
        className={`mb-4 rounded-xl bg-card p-4  ${isSelected ? 'border-2 border-primary' : ''}`}>
        {/* Image */}
        <Image source={pose.imageUrl} style={{ width: '100%', height: 80 }} contentFit="cover" />

        {/* Content */}
        <Text className="mb-1 text-lg font-semibold text-textPrimary">{pose.name}</Text>
        <Text className="mb-2 text-sm text-textSecondary">{pose.description}</Text>

        {/* Tags */}
        <View className="flex-row flex-wrap gap-1">
          {pose.tags.slice(0, 3).map((tag) => (
            <View key={tag} className="bg-surface rounded-md px-2 py-1">
              <Text className="text-xs text-textSecondary">{tag}</Text>
            </View>
          ))}
        </View>

        {/* Premium Badge */}
        {pose.isPremium && (
          <View className="absolute right-2 top-2">
            <View className="rounded-full bg-yellow-100 px-2 py-1">
              <Text className="text-xs font-medium text-yellow-800">Premium</Text>
            </View>
          </View>
        )}

        {/* Selection Indicator */}
        {isSelected && (
          <View className="absolute left-4 top-4">
            <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
              <Text className="text-sm font-bold text-white">✓</Text>
            </View>
          </View>
        )}
      </View>
    </Pressable>
  )
}

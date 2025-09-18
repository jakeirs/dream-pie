import { Image, useImage } from 'expo-image'
import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { Pose } from '@/types/dream'
import { brandColors } from '@/shared/theme'

interface PoseCardProps {
  pose: Pose
  isSelected: boolean
  onSelect: (poseId: string) => void
}

export default function PoseCard({ pose, isSelected, onSelect }: PoseCardProps) {
  const borderOpacity = useSharedValue(0)
  const image = useImage(pose.imageUrl)

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
  }, [isSelected])

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: borderOpacity.value * 2,
    borderColor: brandColors.primary,
  }))

  return (
    <Pressable onPress={() => onSelect(pose.id)}>
      <Animated.View
        className="mb-4 overflow-hidden rounded-xl bg-card"
        style={animatedBorderStyle}>
        {/* Image */}
        {image && (
          <Image
            source={image}
            style={{ width: '100%', height: 120 }}
            className="overflow-hidden rounded-3xl"
            contentFit="cover"
          />
        )}
      
        {/* Content */}
        <Text className="mb-1  font-semibold text-textPrimary">{pose.name}</Text>

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
      </Animated.View>
    </Pressable>
  )
}

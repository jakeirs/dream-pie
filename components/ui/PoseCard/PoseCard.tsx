import { Image } from 'expo-image'
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

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
  }, [isSelected])

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: borderOpacity.value * 3,
    borderColor: brandColors.primary,
  }))

  return (
    <Pressable onPress={() => onSelect(pose.id)}>
      <Animated.View
        className="overflow-hidden rounded-xl bg-card shadow-sm"
        style={animatedBorderStyle}>
        {/* Image Container */}
        <View className="relative">
          {pose.imageUrl && (
            <Image
              source={pose.imageUrl}
              style={{ width: '100%', height: 160 }}
              className="rounded-t-xl"
              contentFit="cover"
            />
          )}

          {/* Premium Badge */}
          {pose.isPremium && (
            <View className="absolute right-3 top-3">
              <View className="rounded-full bg-yellow-100 px-3 py-1.5 shadow-sm">
                <Text className="text-xs font-bold text-yellow-800">Premium</Text>
              </View>
            </View>
          )}

          {/* Selection Indicator */}
          {isSelected && (
            <View className="absolute left-3 top-3">
              <View className="h-7 w-7 items-center justify-center rounded-full bg-primary shadow-md">
                <Text className="text-sm font-bold text-white">✓</Text>
              </View>
            </View>
          )}
        </View>

        {/* Content Container */}
        <View className="h-16 justify-center p-2">
          <Animated.Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="text-center font-bold text-textPrimary">
            {pose.name}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

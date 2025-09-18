import { Image, useImage } from 'expo-image'
import { useEffect } from 'react'
import { View, Text, Pressable } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

import { Selfie } from '@/types/dream/selfie'
import { brandColors } from '@/shared/theme'

interface SelfieCardProps {
  selfie: Selfie
  isSelected: boolean
  onSelect: (selfieId: string) => void
}

export default function SelfieCard({ selfie, isSelected, onSelect }: SelfieCardProps) {
  const borderOpacity = useSharedValue(0)
  const image = useImage(selfie.imageUrl)

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
  }, [isSelected])

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: borderOpacity.value * 3,
    borderColor: brandColors.primary,
  }))

  return (
    <Pressable onPress={() => onSelect(selfie.id)}>
      <Animated.View
        className="overflow-hidden rounded-xl bg-card shadow-sm"
        style={animatedBorderStyle}>
        {/* Image Container */}
        <View className="relative">
          {image && (
            <Image
              source={image}
              style={{ width: '100%', height: 160 }}
              className="rounded-t-xl"
              contentFit="cover"
            />
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
            {selfie.name}
          </Animated.Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}
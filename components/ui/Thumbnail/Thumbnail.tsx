import { View, Text, TouchableOpacity } from 'react-native'
import { Image, useImage } from 'expo-image'
import { useEffect } from 'react'

// 2. Third-party libraries
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated'

// 3. Theme imports
import { brandColors } from '@/shared/theme'

interface ThumbnailProps {
  // Essential display data
  imageUrl: string | number | { uri: string }
  title: string
  subtitle?: string

  // Selection with border animation
  isSelected?: boolean
  onPress?: () => void

  // Premium badge
  isPremium?: boolean

  // Layout
  className?: string
}

const Thumbnail = ({
  imageUrl,
  title,
  subtitle,
  isSelected = false,
  onPress,
  isPremium = false,
  className = '',
}: ThumbnailProps) => {
  // Use useImage hook to prevent Android crashes with rapid image loading changes
  const image = useImage(imageUrl)

  // Border animation following PoseCard pattern
  const borderOpacity = useSharedValue(0)

  useEffect(() => {
    borderOpacity.value = withTiming(isSelected ? 1 : 0, { duration: 300 })
  }, [isSelected])

  const animatedBorderStyle = useAnimatedStyle(() => ({
    borderWidth: borderOpacity.value * 3,
    borderColor: brandColors.primary,
  }))

  return (
    <View className={className}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        <Animated.View className="overflow-hidden rounded-xl" style={animatedBorderStyle}>
          {/* Main Image */}
          <Image
            source={image}
            style={{ width: '100%', height: 120 }}
            contentFit="cover"
            transition={200}
          />

          {/* Premium Badge */}
          {isPremium && (
            <View className="absolute right-2 top-2 rounded bg-warning px-2 py-1">
              <Text className="text-xs font-bold text-white">👑 PRO</Text>
            </View>
          )}
        </Animated.View>

        {/* Title and Subtitle at bottom */}
        <View className="mt-2">
          <Text
            className="text-sm font-medium"
            style={{ color: brandColors.textLight }}
            numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              className="mt-1 text-xs"
              style={{ color: brandColors.textSecondary }}
              numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default Thumbnail

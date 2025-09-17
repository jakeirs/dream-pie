// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, Image, TouchableOpacity } from 'react-native'

// 2. Third-party libraries (node_modules dependencies)
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

// 3. Theme imports
import { brandColors } from '@/shared/theme'

interface ThumbnailProps {
  // Essential display data
  imageUrl: string | number | { uri: string } // string (URL), number (require()), or object with uri
  title: string
  subtitle?: string

  // Interaction
  isSelected?: boolean
  onPress?: () => void

  // Premium features
  isPremium?: boolean
  isLocked?: boolean

  // Layout
  aspectRatio?: number
  className?: string
}

const Thumbnail = ({
  imageUrl,
  title,
  subtitle,
  isSelected = false,
  onPress,
  isPremium = false,
  isLocked = false,
  aspectRatio = 0.75,
  className = '',
}: ThumbnailProps) => {
  const scale = useSharedValue(1)

  const gesture = Gesture.Tap()
    .onStart(() => {
      scale.value = withSpring(0.95)
    })
    .onEnd(() => {
      scale.value = withSpring(1)
      if (onPress) {
        runOnJS(onPress)()
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  // Handle different image source types
  const getImageSource = () => {
    if (typeof imageUrl === 'string') {
      return { uri: imageUrl }
    } else if (typeof imageUrl === 'number') {
      return imageUrl // Local require() image
    } else if (imageUrl && typeof imageUrl === 'object' && imageUrl.uri) {
      return imageUrl // Already formatted object
    } else {
      // Fallback to a default or return null
      console.warn('Invalid image URL provided:', imageUrl)
      return { uri: 'https://via.placeholder.com/400x600/cccccc/ffffff?text=No+Image' }
    }
  }

  const containerClasses = `overflow-hidden rounded-xl bg-card ${
    isSelected ? 'border-2' : ''
  } ${className}`

  const containerStyle = {
    aspectRatio,
    borderColor: isSelected ? brandColors.primary : 'transparent',
  }

  const ThumbnailContent = (
    <Animated.View style={[animatedStyle]} className={containerClasses}>
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={0.95}
        className="flex-1">

        {/* Main Image */}
        <Image
          source={getImageSource()}
          className="w-full flex-1"
          resizeMode="cover"
          onError={(error) => {
            console.warn('Image loading error:', error.nativeEvent.error)
          }}
        />

        {/* Premium Badge */}
        {isPremium && (
          <View
            className="absolute right-2 top-2 rounded px-2 py-1"
            style={{ backgroundColor: brandColors.warning }}>
            <Text className="text-xs font-bold text-white">👑 PRO</Text>
          </View>
        )}

        {/* Title and Subtitle */}
        <View className="p-3">
          <Text
            className="text-sm font-medium"
            style={{ color: brandColors.textPrimary }}
            numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text
              className="text-xs"
              style={{ color: brandColors.textSecondary }}>
              {subtitle}
            </Text>
          )}
        </View>

        {/* Premium Lock Overlay */}
        {isLocked && (
          <View className="absolute inset-0 items-center justify-center bg-black/50">
            <Text className="font-bold text-white">Upgrade to Pro</Text>
          </View>
        )}
      </TouchableOpacity>
    </Animated.View>
  )

  return (
    <GestureDetector gesture={gesture}>
      {ThumbnailContent}
    </GestureDetector>
  )
}

export default Thumbnail
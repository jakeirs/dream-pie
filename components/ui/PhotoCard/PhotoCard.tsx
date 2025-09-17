import React from 'react'
import { View, Text, ImageBackground, TouchableOpacity, ImageSourcePropType } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated'
import { usePhotoCardAnimation } from './hooks/useAnimation'

// Types
import { ImageUrl } from '@/types/dream'

const PHOTO_CARD_HEIGHT = 300

// Helper function to convert different image source types to ImageBackground compatible source
const getImageSource = (imageSource: ImageSourcePropType | string | ImageUrl | undefined): ImageSourcePropType => {
  if (!imageSource) {
    return require('@/assets/selfies/extend-photo.jpeg')
  }

  // If it's already a require() result (number), return as is
  if (typeof imageSource === 'number') {
    return imageSource
  }

  // If it's a string URI, convert to uri object
  if (typeof imageSource === 'string') {
    return { uri: imageSource }
  }

  // Handle object types - check if it's not null and is actually an object
  if (typeof imageSource === 'object' && imageSource !== null) {
    // Check if it's our custom ImageUrl format with nested uri
    if ('uri' in imageSource && 'height' in imageSource && 'width' in imageSource) {
      const imageUrlObj = imageSource as ImageUrl
      return { uri: imageUrlObj.uri }
    }

    // If it's already a valid ImageSourcePropType with uri, return as is
    if ('uri' in imageSource || 'testUri' in imageSource) {
      return imageSource as ImageSourcePropType
    }
  }

  // Fallback to default
  return require('@/assets/selfies/extend-photo.jpeg')
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface PhotoCardProps {
  imageSource?: ImageSourcePropType | string | ImageUrl
  onChangePress?: () => void
  onClickCard?: () => void
  title?: string
  className?: string
}

const PhotoCard = ({
  imageSource,
  onChangePress,
  onClickCard,
  title = 'YOUR PHOTO',
  className = ''
}: PhotoCardProps) => {
  const {
    cardScale,
    buttonScale,
    animateCardPress,
    animateCardPressIn,
    animateCardPressOut,
  } = usePhotoCardAnimation()

  // Convert image source to proper format
  const resolvedImageSource = getImageSource(imageSource)

  const handleCardPress = () => {
    animateCardPress()
    onClickCard?.()
    onChangePress?.()
  }

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
  }))

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }))

  return (
    <AnimatedTouchableOpacity
      style={[
        cardAnimatedStyle,
        {
          width: '100%',
          height: PHOTO_CARD_HEIGHT,
        }
      ]}
      className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}
      onPress={handleCardPress}
      onPressIn={animateCardPressIn}
      onPressOut={animateCardPressOut}
      activeOpacity={0.95}>

      <ImageBackground
        source={resolvedImageSource}
        className="flex-1 justify-between"
        resizeMode="cover">

        {/* Title overlay in top-left */}
        <View className="absolute left-4 top-4">
          <Text className="text-lg font-bold text-white drop-shadow-lg">
            {title}
          </Text>
        </View>

        {/* Bottom gradient overlay for button */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          className="absolute bottom-0 left-0 right-0 h-32"
        />

        {/* Change button overlay - now purely visual */}
        <Animated.View
          style={[
            buttonAnimatedStyle,
            {
              position: 'absolute',
              bottom: 24,
              left: 0,
              right: 0,
              alignItems: 'center',
            }
          ]}>
          <View className="rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 border border-white/30">
            <Text className="text-center font-semibold text-white text-base">
              Change
            </Text>
          </View>
        </Animated.View>

      </ImageBackground>
    </AnimatedTouchableOpacity>
  )
}

export default PhotoCard
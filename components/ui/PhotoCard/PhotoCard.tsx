import React from 'react'
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated'
import { usePhotoCardAnimation } from './hooks/useAnimation'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface PhotoCardProps {
  imageSource?: any
  onChangePress?: () => void
  className?: string
}

const PhotoCard = ({
  imageSource = require('@/assets/selfies/extend-photo.jpeg'),
  onChangePress,
  className = ''
}: PhotoCardProps) => {
  const {
    cardScale,
    buttonScale,
    animateCardPress,
    animateCardPressIn,
    animateCardPressOut,
  } = usePhotoCardAnimation()

  const handleCardPress = () => {
    animateCardPress()
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
      style={cardAnimatedStyle}
      className={`relative aspect-[3/4] w-full overflow-hidden rounded-2xl shadow-lg ${className}`}
      onPress={handleCardPress}
      onPressIn={animateCardPressIn}
      onPressOut={animateCardPressOut}
      activeOpacity={0.95}>

      <ImageBackground
        source={imageSource}
        className="flex-1 justify-between"
        resizeMode="cover">

        {/* Title overlay in top-left */}
        <View className="absolute left-4 top-4">
          <Text className="text-lg font-bold text-white drop-shadow-lg">
            YOUR PHOTO
          </Text>
        </View>

        {/* Bottom gradient overlay for button */}
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.6)']}
          className="absolute bottom-0 left-0 right-0 h-32"
        />

        {/* Change button overlay - now purely visual */}
        <Animated.View
          style={buttonAnimatedStyle}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-white/20 backdrop-blur-sm px-6 py-3 border border-white/30">
          <Text className="text-center font-semibold text-white text-base">
            Change
          </Text>
        </Animated.View>

      </ImageBackground>
    </AnimatedTouchableOpacity>
  )
}

export default PhotoCard
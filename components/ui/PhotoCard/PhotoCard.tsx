import React from 'react'
import { View, Text, ImageBackground, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, {
  useAnimatedStyle,
} from 'react-native-reanimated'
import { usePhotoCardAnimation } from './hooks/useAnimation'

const PHOTO_CARD_HEIGHT = 300

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface PhotoCardProps {
  imageSource?: any
  onChangePress?: () => void
  onClickCard?: () => void
  title?: string
  className?: string
}

const PhotoCard = ({
  imageSource = require('@/assets/selfies/extend-photo.jpeg'),
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
        source={imageSource}
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
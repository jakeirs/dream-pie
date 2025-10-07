import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import Animated, { useAnimatedStyle } from 'react-native-reanimated'

import { SelfieIcon } from '@/components/ui/icons/custom/SelfieIcon'
import { PoseIcon } from '@/components/ui/icons/custom/PoseIcon'

import { usePhotoCardAnimation } from './hooks/useAnimation'

import { appAssets } from '@/shared/assets/assets'

const PHOTO_CARD_HEIGHT = 300

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface PhotoCardProps {
  imageSource?: string | number | { uri: string }
  onChangePress?: () => void
  onClickCard?: () => void
  title?: string
  className?: string
  type?: 'selfie' | 'pose'
}

export const PhotoCard = ({
  imageSource,
  onChangePress,
  onClickCard,
  title = 'YOUR PHOTO',
  className = '',
  type = 'selfie',
}: PhotoCardProps) => {
  const { cardScale, buttonScale, animateCardPress, animateCardPressIn, animateCardPressOut } =
    usePhotoCardAnimation()

  // Simple image source handling (like CustomImage)
  // Let expo-image handle numeric IDs, URI objects, and strings natively

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

  // Determine if we should show empty state
  const showEmptyState = !imageSource

  return (
    <AnimatedTouchableOpacity
      style={[
        cardAnimatedStyle,
        {
          width: '100%',
          height: PHOTO_CARD_HEIGHT,
        },
      ]}
      className={`relative overflow-hidden rounded-2xl shadow-lg ${className}`}
      onPress={handleCardPress}
      onPressIn={animateCardPressIn}
      onPressOut={animateCardPressOut}
      activeOpacity={0.95}>
      {/* Background Image */}
      {showEmptyState ? (
        <>
          {/* Empty State: Blurred Background */}
          <Image
            source={appAssets.selfies.extendPhoto}
            style={{ width: '100%', height: '100%' }}
            contentFit="cover"
            blurRadius={100}
          />
          {/* Dark overlay for better icon contrast */}
          <View
            style={StyleSheet.absoluteFill}
            className="items-center justify-center bg-black/40">
            {/* Icon based on type */}
            {type === 'selfie' ? (
              <SelfieIcon size={90} primaryColor="#1F1F1F" secondaryColor="#FFFFFF" />
            ) : (
              <PoseIcon size={90} primaryColor="#1F1F1F" secondaryColor="#FFFFFF" />
            )}
          </View>
        </>
      ) : (
        <Image
          source={imageSource}
          style={{ width: '100%', height: '100%' }}
          contentFit="cover"
          onError={(error) => {
            console.warn('PhotoCard image loading error:', error.error)
          }}
        />
      )}

      {/* Title overlay in top-left */}
      <View className="absolute left-4 top-4">
        <Text className="text-lg font-bold text-white drop-shadow-lg">{title}</Text>
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
          },
        ]}>
        <View className="rounded-full border border-white/30 bg-white/20 px-6 py-3 backdrop-blur-sm">
          <Text className="text-center text-base font-semibold text-white">Change</Text>
        </View>
      </Animated.View>
    </AnimatedTouchableOpacity>
  )
}

import { View } from 'react-native'

import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated'

import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

import { Pose } from '@/types/dream/pose'

interface ResultViewProps {
  selectedPose: Pose | null
  scale: SharedValue<number>
  onChangePress?: () => void
}

/**
 * ResultView - Shows PhotoCard with selected pose after transition
 *
 * Positioned absolutely behind PixelatedEffect and scales from 0.3 to 1.0
 * as the particle effect disappears.
 */
export default function ResultView({ selectedPose, scale, onChangePress }: ResultViewProps) {
  if (!selectedPose) return null

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 20,
        },
        animatedStyle,
      ]}>
      <PhotoCard
        imageSource={selectedPose.imageUrl}
        title="GENERATED PHOTO"
        onChangePress={onChangePress}
      />
    </Animated.View>
  )
}

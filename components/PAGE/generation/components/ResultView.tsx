import { useRef } from 'react'
import Animated, {
  useAnimatedStyle,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated'
import { Confetti } from 'react-native-fast-confetti'

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
 * as the particle effect disappears. Triggers confetti when fully scaled.
 */
export default function ResultView({ selectedPose, scale, onChangePress }: ResultViewProps) {
  const confettiRef = useRef<any>(null)

  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.restart()
    }
  }

  // Use useAnimatedReaction to monitor scale value changes
  useAnimatedReaction(
    () => scale.value,
    (currentScale, previousScale) => {
      if (currentScale >= 0.99 && (previousScale === null || previousScale < 0.99)) {
        runOnJS(triggerConfetti)()
      }
    }
  )

  if (!selectedPose) return null

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    }
  })

  return (
    <>
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
      <Confetti
        ref={confettiRef}
        count={200}
        autoplay={false}
        isInfinite={false}
        fallDuration={3000}
        blastDuration={400}
        flakeSize={{ width: 10, height: 10 }}
      />
    </>
  )
}

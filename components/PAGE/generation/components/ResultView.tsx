import { useRef, useState } from 'react'
import Animated, {
  useAnimatedStyle,
  SharedValue,
  useAnimatedReaction,
  runOnJS,
} from 'react-native-reanimated'
import { Confetti } from 'react-native-fast-confetti'

import ZoomablePhoto from '@/components/ui/ZoomablePhoto/ZoomablePhoto'
import SuccessMessage from '@/components/ui/SuccessMessage/SuccessMessage'

import { Pose } from '@/types/dream/pose'

interface ResultViewProps {
  selectedPose: Pose | null
  scale: SharedValue<number>
  onChangePress?: () => void
}

/**
 * ResultView - Shows ZoomablePhoto with selected pose after transition
 *
 * Positioned absolutely behind PixelatedEffect and scales from 0.3 to 1.0
 * as the particle effect disappears. Triggers confetti and UI elements when fully scaled.
 * Supports pinch-to-zoom for viewing generated photos.
 */
export default function ResultView({ selectedPose, scale }: ResultViewProps) {
  const confettiRef = useRef<any>(null)
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const triggerUIElements = () => {
    if (confettiRef.current) {
      confettiRef.current.restart()
    }
    setShowSuccessMessage(true)
  }

  // Use useAnimatedReaction to monitor scale value changes
  useAnimatedReaction(
    () => scale.value,
    (currentScale, previousScale) => {
      if (currentScale >= 0.99 && (previousScale === null || previousScale < 0.99)) {
        runOnJS(triggerUIElements)()
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
        <ZoomablePhoto imageSource={selectedPose.imageUrl} maxScale={3} contentFit="contain" />
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

      <SuccessMessage
        message="✨ Your Dream Photo is Ready!"
        visible={showSuccessMessage}
        duration={2500}
        onDismiss={() => setShowSuccessMessage(false)}
      />
    </>
  )
}

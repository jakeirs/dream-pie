import { View } from 'react-native'

import Animated, { FadeIn } from 'react-native-reanimated'

import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

import { Pose } from '@/types/dream/pose'
import { TRANSITION_CONFIG } from '../config/transitionConfig'

interface ResultViewProps {
  selectedPose: Pose | null
  onChangePress?: () => void
}

/**
 * ResultView - Shows PhotoCard with selected pose after transition
 *
 * Displays the generated result using PhotoCard component with
 * smooth fade-in animation.
 */
export default function ResultView({ selectedPose, onChangePress }: ResultViewProps) {
  if (!selectedPose) return null

  return (
    <Animated.View
      entering={FadeIn.duration(TRANSITION_CONFIG.DURATION.FADE_IN_RESULT).delay(
        TRANSITION_CONFIG.DURATION.DELAY_RESULT
      )}
      style={{
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
      }}>
      <PhotoCard
        imageSource={selectedPose.imageUrl}
        title="GENERATED PHOTO"
        onChangePress={onChangePress}
      />
    </Animated.View>
  )
}

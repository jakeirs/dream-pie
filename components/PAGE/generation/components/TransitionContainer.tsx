import { View } from 'react-native'

import Animated, { useAnimatedStyle, SharedValue } from 'react-native-reanimated'

import { TRANSITION_CONFIG } from '../config/transitionConfig'
import { TransitionState } from '../types/types'

interface TransitionContainerProps {
  children: React.ReactNode
  scale: SharedValue<number>
  opacity: SharedValue<number>
  transitionState: TransitionState
}

/**
 * TransitionContainer - Wraps content with scale and opacity animations
 *
 * Provides smooth transition sequence:
 * 1. fullScreen: Full screen (scale: 1.0, opacity: 1.0)
 * 2. scaledDown: Scaled down (scale: 0.35, opacity: 1.0) with rounded corners
 * 3. fadingOut: Fading out (scale: 0.35, opacity: 1.0 → 0.0)
 * 4. hiddenParticles: Children unmounted (cleanup triggered)
 *
 * Maintains aspect ratio throughout all transitions.
 * Unmounts children only after fade-out animation completes.
 */
export default function TransitionContainer({
  children,
  scale,
  opacity,
  transitionState,
}: TransitionContainerProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  const isScaled = transitionState !== 'fullScreen'

  // Only unmount after fade-out animation completes (hiddenParticles state)
  if (transitionState === 'hiddenParticles') {
    return null
  }

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={[
          animatedStyle,
          {
            flex: 1,
            borderRadius: isScaled ? TRANSITION_CONFIG.BORDER_RADIUS : 0,
            overflow: 'hidden',
          },
        ]}>
        {children}
      </Animated.View>
    </View>
  )
}

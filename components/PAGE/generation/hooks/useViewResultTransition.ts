import { useState, useCallback } from 'react'

import { useSharedValue, withSpring, withTiming, withDelay } from 'react-native-reanimated'

import { TRANSITION_CONFIG } from '../components/ParticlesImage/config/transitionConfig'
import { TransitionState } from '../components/ParticlesImage/types/types'

/**
 * Custom hook for managing the View Result transition
 *
 * Handles the four-stage transition:
 * 1. fullScreen → scaledDown: Scale down particle effect (shows PhotoCard)
 * 2. scaledDown (hold): PhotoCard visible with scaled particle effect
 * 3. scaledDown → fadingOut: Particle effect fades out (opacity to 0)
 * 4. fadingOut → hiddenParticles: Unmount after fade completes
 *
 * Uses Reanimated's withSpring and withTiming for precise control
 */
export function useViewResultTransition() {
  const [transitionState, setTransitionState] = useState<TransitionState>('fullScreen')

  // Shared values for smooth animations
  const scale = useSharedValue<number>(TRANSITION_CONFIG.SCALE.FULL_SCREEN)
  const opacity = useSharedValue<number>(TRANSITION_CONFIG.OPACITY.VISIBLE)
  const resultScale = useSharedValue<number>(TRANSITION_CONFIG.SCALE.SCALED_DOWN)

  /**
   * Trigger transition sequence:
   * 1. Scale down (fullScreen → scaledDown)
   * 2. Wait, then start fade out (scaledDown → fadingOut)
   * 3. After fade completes, unmount (fadingOut → hiddenParticles)
   */
  const startTransition = useCallback(() => {
    // Stage 1: Scale down
    setTransitionState('scaledDown')
    scale.value = withSpring(TRANSITION_CONFIG.SCALE.SCALED_DOWN, TRANSITION_CONFIG.SPRING_CONFIG)

    // Stage 2: After delay, start fade out and scale up ResultView
    setTimeout(() => {
      setTransitionState('fadingOut')
      opacity.value = withTiming(TRANSITION_CONFIG.OPACITY.HIDDEN, {
        duration: TRANSITION_CONFIG.DURATION.FADE_OUT,
      })
      // Scale up ResultView as PixelatedEffect fades out
      resultScale.value = withSpring(
        TRANSITION_CONFIG.SCALE.FULL_SCREEN,
        TRANSITION_CONFIG.SPRING_CONFIG
      )

      // Stage 3: After fade completes, trigger unmount
      setTimeout(() => {
        setTransitionState('hiddenParticles')
      }, TRANSITION_CONFIG.DURATION.FADE_OUT)
    }, TRANSITION_CONFIG.DURATION.SCALE_DOWN + TRANSITION_CONFIG.DURATION.DELAY_FADE_OUT)
  }, [scale, opacity, resultScale])

  return {
    transitionState,
    scale,
    opacity,
    resultScale,
    startTransition,
    // State checks
    isFullScreen: transitionState === 'fullScreen',
    isScaledDown: transitionState === 'scaledDown',
    isFadingOut: transitionState === 'fadingOut',
    isHiddenParticles: transitionState === 'hiddenParticles',
    // Helper: Show ResultView for scaledDown, fadingOut, and hiddenParticles states
    showResultView: transitionState !== 'fullScreen',
  }
}

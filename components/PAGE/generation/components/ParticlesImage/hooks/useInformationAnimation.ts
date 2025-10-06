import { useEffect, useState } from 'react'
import { useWindowDimensions } from 'react-native'

import { useSharedValue, withSpring } from 'react-native-reanimated'

import { INFORMATION_CONFIG } from '../config/informationConfig'
import { InformationPosition } from '../types/types'

/**
 * Custom hook for animating information bubble with physics-based positioning
 *
 * Cycles through messages with timed visibility:
 * - Appears at random position (fade in)
 * - Stays visible for VISIBLE_DURATION
 * - Fades out
 * - Stays hidden for HIDDEN_DURATION
 * - Calculates new random position
 * - Repeats with next message
 *
 * Position generation uses similar safe zone logic as particle system
 * to avoid screen edges.
 *
 * @param shouldAnimate - Control whether the animation cycle should run
 */
export function useInformationAnimation(shouldAnimate = true) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions()

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  const centerX = screenWidth / 2 - INFORMATION_CONFIG.BUBBLE_WIDTH / 2
  const centerY = screenHeight / 2 - INFORMATION_CONFIG.BUBBLE_HEIGHT / 2

  const x = useSharedValue<number>(centerX)
  const y = useSharedValue<number>(centerY)
  const repulsionStrength = useSharedValue<number>(0)

  const generateRandomPosition = (): InformationPosition => {
    const { POSITION_VARIANCE, BUBBLE_WIDTH, BUBBLE_HEIGHT } = INFORMATION_CONFIG

    const centerX = screenWidth / 2 - BUBBLE_WIDTH / 2
    const centerY = screenHeight / 2 - BUBBLE_HEIGHT / 2

    const offsetX = (Math.random() - 0.5) * 2 * POSITION_VARIANCE.X_MAX
    const offsetY = (Math.random() - 0.5) * 2 * POSITION_VARIANCE.Y_MAX

    const x = Math.max(0, Math.min(screenWidth - BUBBLE_WIDTH, centerX + offsetX))
    const y = Math.max(0, Math.min(screenHeight - BUBBLE_HEIGHT, centerY + offsetY))

    return { x, y }
  }

  useEffect(() => {
    // Don't start animation cycle if shouldAnimate is false
    if (!shouldAnimate) {
      setIsVisible(false)
      repulsionStrength.value = withSpring(0, { damping: 15, stiffness: 100 })
      return
    }

    let visibilityTimer: NodeJS.Timeout
    let hiddenTimer: NodeJS.Timeout

    const runAnimationCycle = () => {
      const newPosition = generateRandomPosition()
      x.value = withSpring(newPosition.x, INFORMATION_CONFIG.SPRING_CONFIG)
      y.value = withSpring(newPosition.y, INFORMATION_CONFIG.SPRING_CONFIG)

      setIsVisible(true)
      repulsionStrength.value = withSpring(1, { damping: 20, stiffness: 90 })

      visibilityTimer = setTimeout(() => {
        setIsVisible(false)
        repulsionStrength.value = withSpring(0, { damping: 15, stiffness: 100 })

        hiddenTimer = setTimeout(() => {
          setCurrentMessageIndex(
            (prevIndex) => (prevIndex + 1) % INFORMATION_CONFIG.MESSAGES.length
          )

          runAnimationCycle()
        }, INFORMATION_CONFIG.HIDDEN_DURATION)
      }, INFORMATION_CONFIG.VISIBLE_DURATION)
    }

    runAnimationCycle()

    return () => {
      clearTimeout(visibilityTimer)
      clearTimeout(hiddenTimer)
    }
  }, [screenWidth, screenHeight, x, y, shouldAnimate, repulsionStrength])

  return {
    currentMessage: INFORMATION_CONFIG.MESSAGES[currentMessageIndex],
    isVisible,
    x,
    y,
    bubbleWidth: INFORMATION_CONFIG.BUBBLE_WIDTH,
    bubbleHeight: INFORMATION_CONFIG.BUBBLE_HEIGHT,
    repulsionPadding: INFORMATION_CONFIG.REPULSION_PADDING,
    repulsionStrength,
  }
}

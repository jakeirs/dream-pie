import {
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated'
import { useCallback, useState } from 'react'

export const useExploreAnimations = () => {
  const scale = useSharedValue(1)
  const rotate = useSharedValue(0)
  const [animationCounter, setAnimationCounter] = useState(0)

  const handleStarAnimation = useCallback(() => {
    scale.value = withSequence(withSpring(1.2), withSpring(1))
    rotate.value = withTiming(rotate.value + 180, { duration: 500 })
    runOnJS(setAnimationCounter)((prev) => prev + 1)
  }, [])

  const resetAnimations = useCallback(() => {
    scale.value = withSpring(1)
    rotate.value = withTiming(0)
    runOnJS(setAnimationCounter)(0)
  }, [])

  return {
    values: { scale, rotate },
    animationCounter,
    handleStarAnimation,
    resetAnimations,
  }
}

export const useFeatureCards = () => {
  const [activeCard, setActiveCard] = useState<string | null>(null)

  const handleCardPress = useCallback(
    (cardId: string) => {
      setActiveCard(activeCard === cardId ? null : cardId)
    },
    [activeCard]
  )

  return {
    activeCard,
    handleCardPress,
  }
}

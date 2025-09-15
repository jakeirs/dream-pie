import React from 'react'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated'
import { brandColors } from '@/shared/theme'

interface AnimatedBoxProps {
  children?: React.ReactNode
  className?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'square' | 'rounded' | 'circle'
  animation?: 'none' | 'pulse' | 'bounce' | 'rotate' | 'shake' | 'colorShift'
  trigger?: boolean
}

const sizes = {
  sm: 'h-16 w-16',
  md: 'h-24 w-24',
  lg: 'h-32 w-32',
  xl: 'h-40 w-40',
}

const shapes = {
  square: '',
  rounded: 'rounded-2xl',
  circle: 'rounded-full',
}

export const AnimatedBox = ({
  children,
  className = '',
  size = 'md',
  shape = 'rounded',
  animation = 'none',
  trigger = false,
}: AnimatedBoxProps) => {
  const scale = useSharedValue(1)
  const rotation = useSharedValue(0)
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)
  const colorProgress = useSharedValue(0)

  React.useEffect(() => {
    if (animation === 'pulse') {
      scale.value = withRepeat(
        withSequence(withTiming(1.1, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        false
      )
    } else if (animation === 'bounce') {
      translateY.value = withRepeat(
        withSequence(
          withSpring(-20, { damping: 8, stiffness: 200 }),
          withSpring(0, { damping: 8, stiffness: 200 })
        ),
        -1,
        false
      )
    } else if (animation === 'rotate') {
      rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false)
    } else if (animation === 'shake') {
      translateX.value = withRepeat(
        withSequence(
          withTiming(-5, { duration: 100 }),
          withTiming(5, { duration: 100 }),
          withTiming(0, { duration: 100 })
        ),
        -1,
        true
      )
    } else if (animation === 'colorShift') {
      colorProgress.value = withRepeat(withTiming(1, { duration: 2000 }), -1, true)
    }
  }, [animation])

  React.useEffect(() => {
    if (trigger && animation !== 'none') {
      if (animation === 'pulse') {
        scale.value = withSequence(withSpring(1.3), withSpring(1))
      } else if (animation === 'bounce') {
        translateY.value = withSequence(withSpring(-30), withSpring(0))
      } else if (animation === 'rotate') {
        rotation.value = withTiming(rotation.value + 360, { duration: 1000 })
      } else if (animation === 'shake') {
        translateX.value = withSequence(
          withTiming(-10, { duration: 50 }),
          withRepeat(withTiming(10, { duration: 100 }), 3, true),
          withTiming(0, { duration: 50 })
        )
      } else if (animation === 'colorShift') {
        colorProgress.value = withTiming(colorProgress.value === 0 ? 1 : 0, { duration: 1000 })
      }
    }
  }, [trigger, animation])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
      { translateX: translateX.value },
      { translateY: translateY.value },
    ],
  }))

  const colorAnimatedStyle = useAnimatedStyle(() => {
    if (animation === 'colorShift') {
      return {
        backgroundColor: interpolateColor(
          colorProgress.value,
          [0, 0.5, 1],
          [brandColors.accent, brandColors.error, brandColors.success]
        ),
      }
    }
    return {}
  })

  const baseClasses = `items-center justify-center shadow-lg ${sizes[size]} ${shapes[shape]} ${className}`

  return (
    <Animated.View style={[animatedStyle, colorAnimatedStyle]} className={baseClasses}>
      {children}
    </Animated.View>
  )
}

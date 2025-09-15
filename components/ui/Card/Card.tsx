import React from 'react'
import { Text } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'

interface CardProps {
  title?: string
  description?: string
  children?: React.ReactNode
  variant?: 'default' | 'info' | 'success' | 'warning' | 'danger'
  className?: string
  onPress?: () => void
  interactive?: boolean
}

const variants = {
  default: 'bg-white',
  info: 'bg-blue-50',
  success: 'bg-green-50',
  warning: 'bg-orange-50',
  danger: 'bg-red-50',
}

const titleColors = {
  default: 'text-gray-800',
  info: 'text-blue-800',
  success: 'text-green-800',
  warning: 'text-orange-800',
  danger: 'text-red-800',
}

const descriptionColors = {
  default: 'text-gray-600',
  info: 'text-blue-600',
  success: 'text-green-600',
  warning: 'text-orange-600',
  danger: 'text-red-600',
}

export const Card = ({
  title,
  description,
  children,
  variant = 'default',
  className = '',
  onPress,
  interactive = false,
}: CardProps) => {
  const scale = useSharedValue(1)
  const rotateY = useSharedValue(0)
  const translateX = useSharedValue(0)

  const gesture = Gesture.Pan()
    .onStart(() => {
      if (interactive) {
        scale.value = withSpring(1.05)
      }
    })
    .onUpdate((event) => {
      if (interactive) {
        translateX.value = event.translationX * 0.1
        rotateY.value = interpolate(event.translationX, [-100, 100], [-5, 5])
      }
    })
    .onEnd(() => {
      if (interactive) {
        scale.value = withSpring(1)
        translateX.value = withSpring(0)
        rotateY.value = withSpring(0)
        if (onPress) {
          runOnJS(onPress)()
        }
      }
    })

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { rotateY: `${rotateY.value}deg` },
    ],
  }))

  const baseClasses = `rounded-lg p-4 shadow-sm ${variants[variant]} ${className}`

  const CardContent = (
    <Animated.View style={interactive ? animatedStyle : undefined} className={baseClasses}>
      {title && (
        <Text className={`mb-2 text-lg font-semibold ${titleColors[variant]}`}>{title}</Text>
      )}
      {description && <Text className={`mb-3 ${descriptionColors[variant]}`}>{description}</Text>}
      {children}
    </Animated.View>
  )

  if (interactive) {
    return <GestureDetector gesture={gesture}>{CardContent}</GestureDetector>
  }

  return CardContent
}

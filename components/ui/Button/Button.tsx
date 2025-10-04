import React from 'react'
import { TouchableOpacity, Text, ViewStyle, View } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated'

import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme/colors'

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

interface ButtonProps {
  title?: string
  children?: React.ReactNode
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent' | 'primaryForeground'
  size?: 'sm' | 'md' | 'lg' | 'small'
  disabled?: boolean
  className?: string
  style?: ViewStyle
  isHollow?: boolean
  icon?: {
    family: ICON_FAMILY_NAME
    name: string
    size?: number
    position?: 'left' | 'right'
  }
}

const variants = {
  primary: 'bg-primary text-primaryForeground',
  secondary: 'bg-cardSecondary text-textPrimary',
  success: 'bg-success text-successForeground',
  warning: 'bg-warning text-warningForeground',
  error: 'bg-error text-errorForeground',
  accent: 'bg-accent text-accentForeground',
  primaryForeground: 'bg-primaryForeground text-primary',
}

const hollowVariants = {
  primary: 'bg-transparent border-4 border-primary text-primary',
  secondary: 'bg-transparent border-4 border-cardSecondary text-textPrimary',
  success: 'bg-transparent border-4 border-success text-success',
  warning: 'bg-transparent border-4 border-warning text-warning',
  error: 'bg-transparent border-4 border-error text-error',
  accent: 'bg-transparent border-4 border-accent text-accent',
  primaryForeground: 'bg-transparent border-4 border-primaryForeground text-primaryForeground',
}

const sizes = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
  small: 'px-3 py-1', // Added small size for compatibility
}

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  small: 'text-xs',
}

const Button = ({
  title,
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  style,
  isHollow = false,
  icon,
}: ButtonProps) => {
  const scale = useSharedValue(1)

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 })
  }

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, { damping: 15, stiffness: 300 }),
      withTiming(1, { duration: 100 })
    )
  }

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }))

  const variantClasses = isHollow ? hollowVariants[variant] : variants[variant]
  const baseClasses = `rounded-full ${variantClasses} ${sizes[size]} ${
    disabled ? 'opacity-50' : ''
  } ${className} ${!isHollow ? 'shadow-md shadow-primaryForeground' : ''}`

  const iconSize = icon?.size || (size === 'sm' || size === 'small' ? 16 : size === 'lg' ? 24 : 20)

  // Get color based on variant and hollow state
  const getVariantColor = () => {
    if (isHollow) {
      switch (variant) {
        case 'primary':
          return brandColors.textPrimary
        case 'secondary':
          return brandColors.textPrimary
        case 'success':
          return brandColors.success
        case 'warning':
          return brandColors.warning
        case 'error':
          return brandColors.error
        case 'accent':
          return brandColors.accent
        case 'primaryForeground':
          return brandColors.primaryForeground
        default:
          return brandColors.primary
      }
    }
    // Solid button foreground colors
    switch (variant) {
      case 'primary':
        return brandColors.primaryForeground
      case 'secondary':
        return brandColors.textPrimary
      case 'success':
        return brandColors.successForeground
      case 'warning':
        return brandColors.warningForeground
      case 'error':
        return brandColors.errorForeground
      case 'accent':
        return brandColors.accentForeground
      case 'primaryForeground':
        return brandColors.primary
      default:
        return brandColors.primaryForeground
    }
  }

  const iconColor = getVariantColor()

  const renderContent = () => {
    if (children) return children

    const textContent = (
      <Text className={`text-center font-semibold ${textSizes[size]}`} style={{ color: iconColor }}>
        {title}
      </Text>
    )

    if (!icon) return textContent

    return (
      <View className="flex-row items-center justify-center gap-2">
        {icon.position !== 'right' && (
          <Icon family={icon.family} name={icon.name} size={iconSize} color={iconColor} />
        )}
        {title && textContent}
        {icon.position === 'right' && (
          <Icon family={icon.family} name={icon.name} size={iconSize} color={iconColor} />
        )}
      </View>
    )
  }

  return (
    <AnimatedTouchableOpacity
      style={[animatedStyle, style]}
      className={baseClasses}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}>
      {renderContent()}
    </AnimatedTouchableOpacity>
  )
}

export default Button

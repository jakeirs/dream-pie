import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

const variants = {
  primary: 'bg-primary text-primaryForeground',
  secondary: 'bg-cardSecondary text-textPrimary',
  success: 'bg-success text-successForeground',
  warning: 'bg-warning text-warningForeground',
  error: 'bg-error text-errorForeground',
  accent: 'bg-accent text-accentForeground',
};

const sizes = {
  sm: 'px-3 py-2',
  md: 'px-4 py-2',
  lg: 'px-6 py-3',
};

const textSizes = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

export const Button = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
}: ButtonProps) => {
  const scale = useSharedValue(1);

  const handlePressIn = () => {
    scale.value = withSpring(0.95, { damping: 15, stiffness: 300 });
  };

  const handlePressOut = () => {
    scale.value = withSequence(
      withSpring(1.05, { damping: 15, stiffness: 300 }),
      withTiming(1, { duration: 100 })
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const baseClasses = `rounded-lg ${variants[variant]} ${sizes[size]} ${
    disabled ? 'opacity-50' : ''
  } ${className}`;

  return (
    <AnimatedTouchableOpacity
      style={animatedStyle}
      className={baseClasses}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      activeOpacity={0.8}>
      <Text className={`text-center font-semibold ${textSizes[size]}`}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};

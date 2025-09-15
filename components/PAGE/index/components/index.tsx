import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui';
import { AnimationControlsType } from '../types';

interface AnimationControlsProps {
  animations: AnimationControlsType;
}

export const AnimationControls = ({ animations }: AnimationControlsProps) => {
  const buttonConfigs = [
    { title: 'Scale', onPress: animations.handleScaleAnimation, variant: 'primary' as const },
    { title: 'Rotate', onPress: animations.handleRotationAnimation, variant: 'success' as const },
    { title: 'Bounce', onPress: animations.handleBounceAnimation, variant: 'secondary' as const },
    { title: 'Shake', onPress: animations.handleShakeAnimation, variant: 'warning' as const },
    { title: 'Fade', onPress: animations.handleFadeAnimation, variant: 'accent' as const },
    { title: 'Color', onPress: animations.handleColorAnimation, variant: 'error' as const },
    { title: 'Spin', onPress: animations.handleContinuousRotation, variant: 'success' as const },
    { title: 'Slide', onPress: animations.handleSlideAnimation, variant: 'primary' as const },
    { title: 'Flip', onPress: animations.handleFlipAnimation, variant: 'secondary' as const },
    { title: 'Pulse', onPress: animations.handlePulseAnimation, variant: 'warning' as const },
  ];

  return (
    <View className="mb-8 space-y-4">
      <Text className="text-center text-xl font-semibold text-textSecondary">Reanimated Animations</Text>
      <View className="flex-row flex-wrap justify-center gap-3">
        {buttonConfigs.map(({ title, onPress, variant }) => (
          <Button key={title} title={title} onPress={onPress} variant={variant} size="md" />
        ))}
      </View>
    </View>
  );
};

export const FeatureList = () => {
  const features = [
    'React Native Reanimated 4.1.0',
    'Multiple animation types (scale, rotate, bounce, shake, fade)',
    'Advanced animations (slide, flip, pulse)',
    'Color interpolation animations',
    '@gorhom/bottom-sheet integration',
    'Gesture handling with react-native-gesture-handler',
    'NativeWind styling integration',
    'Now with Expo Router navigation! 🚀',
    'Centralized color theming system! 🎨',
    'Organized component structure',
  ];

  return (
    <View className="mt-8 rounded-lg bg-card p-4 shadow border border-borderLight">
      <Text className="mb-3 text-lg font-semibold text-textPrimary">Features Demonstrated:</Text>
      {features.map((feature, index) => (
        <Text key={index} className="mb-2 text-textSecondary">
          • {feature}
        </Text>
      ))}
    </View>
  );
};

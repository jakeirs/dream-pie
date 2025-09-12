import {
  useSharedValue,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
} from 'react-native-reanimated';
import { useCallback } from 'react';

export const useAnimationControls = () => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  const handleScaleAnimation = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.3, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  }, []);

  const handleRotationAnimation = useCallback(() => {
    rotation.value = withTiming(rotation.value + 360, { duration: 1000 });
  }, []);

  const handleBounceAnimation = useCallback(() => {
    translateY.value = withSequence(
      withTiming(-50, { duration: 300 }),
      withSpring(0, { damping: 8, stiffness: 200 })
    );
  }, []);

  const handleShakeAnimation = useCallback(() => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    );
  }, []);

  const handleFadeAnimation = useCallback(() => {
    opacity.value = withSequence(
      withTiming(0.2, { duration: 500 }),
      withTiming(1, { duration: 500 })
    );
  }, []);

  const handleColorAnimation = useCallback(() => {
    colorProgress.value = withTiming(colorProgress.value === 0 ? 1 : 0, { duration: 1000 });
  }, []);

  const handleContinuousRotation = useCallback(() => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
  }, []);

  const handleSlideAnimation = useCallback(() => {
    translateX.value = withSequence(
      withTiming(50, { duration: 300 }),
      withSpring(0, { damping: 8, stiffness: 200 })
    );
  }, []);

  const handleFlipAnimation = useCallback(() => {
    rotation.value = withTiming(rotation.value + 180, { duration: 600 });
  }, []);

  const handlePulseAnimation = useCallback(() => {
    scale.value = withSequence(
      withTiming(1.2, { duration: 200 }),
      withTiming(1.1, { duration: 200 }),
      withTiming(1.2, { duration: 200 }),
      withTiming(1, { duration: 200 })
    );
  }, []);

  return {
    values: { scale, rotation, translateX, translateY, opacity, colorProgress },
    animations: {
      handleScaleAnimation,
      handleRotationAnimation,
      handleBounceAnimation,
      handleShakeAnimation,
      handleFadeAnimation,
      handleColorAnimation,
      handleContinuousRotation,
      handleSlideAnimation,
      handleFlipAnimation,
      handlePulseAnimation,
    },
  };
};

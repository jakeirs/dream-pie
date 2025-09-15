import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import BottomSheetLib from '@gorhom/bottom-sheet';
import { useAnimationControls } from './hooks';
import { AnimationControls, FeatureList, BottomSheetContent } from './components';
import { Button, PageHeader, ICON_FAMILY_NAME, BottomSheet } from '@/components/ui';
import { IndexPageProps } from './types';
import { brandColors } from '@/shared/theme';

export default function IndexPage({ className = '' }: IndexPageProps) {
  const { values, animations } = useAnimationControls();

  // Bottom Sheet ref
  const scrollViewBottomSheetRef = useRef<BottomSheetLib>(null);

  // Bottom sheet functions
  const handleOpenBottomSheet = useCallback(() => {
    scrollViewBottomSheetRef.current?.expand();
  }, []);

  const closeBottomSheet = useCallback((type: string) => {
    scrollViewBottomSheetRef.current?.close();
  }, []);

  const handleSettingsPress = useCallback(() => {
    console.log('Settings pressed!');
  }, []);

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: values.scale.value },
        { rotate: `${values.rotation.value}deg` },
        { translateX: values.translateX.value },
        { translateY: values.translateY.value },
      ],
      opacity: values.opacity.value,
    };
  });

  const colorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(
        values.colorProgress.value,
        [0, 1],
        [brandColors.accent, brandColors.error]
      ),
    };
  });

  return (
    <View className={`flex-1 bg-background ${className}`}>
      <PageHeader
        title="Home"
        rightIcon={{
          name: 'cog',
          family: ICON_FAMILY_NAME.FontAwesome5,
          onPress: handleSettingsPress,
        }}
      />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-8 text-center text-3xl font-bold text-textPrimary">
          Reanimated 4 + Bottom Sheet Demo
        </Text>

        {/* Animated Box */}
        <View className="mb-8 items-center">
          <Animated.View
            style={[animatedStyle, colorAnimatedStyle]}
            className="h-24 w-24 items-center justify-center rounded-2xl shadow-lg">
            <Text className="text-lg font-bold text-white">🎯</Text>
          </Animated.View>
        </View>

        {/* Animation Controls using new component */}
        <AnimationControls animations={animations} />

        {/* Bottom Sheet Controls */}
        <View className="mb-8 space-y-4">
          <Text className="text-center text-xl font-semibold text-textSecondary">
            Bottom Sheet Demo
          </Text>
          <View className="items-center">
            <Button
              title="Show Mock Data"
              onPress={handleOpenBottomSheet}
              variant="primary"
              size="lg"
              className="px-8"
            />
          </View>
        </View>

        {/* Feature List using new component */}
        <FeatureList />
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet ref={scrollViewBottomSheetRef} scrollView={true}>
        <BottomSheetContent demo={undefined} onClose={() => closeBottomSheet('scrollView')} />
      </BottomSheet>
    </View>
  );
}

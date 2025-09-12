import React, { useRef, useCallback } from 'react';
import { View, Text, ScrollView } from 'react-native';
import Animated, { useAnimatedStyle, interpolateColor } from 'react-native-reanimated';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { useAnimationControls } from './hooks';
import { AnimationControls, FeatureList } from './components';
import { Button } from '../../ui';
import { IndexPageProps } from './types';

export default function IndexPage({ className = '' }: IndexPageProps) {
  const { values, animations } = useAnimationControls();

  // Bottom Sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

  // Bottom sheet functions
  const handleOpenBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleCloseBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={0} opacity={0.5} />
    ),
    []
  );

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
      backgroundColor: interpolateColor(values.colorProgress.value, [0, 1], ['#3B82F6', '#EF4444']),
    };
  });

  return (
    <View className={`flex-1 bg-gray-100 ${className}`}>
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">
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
          <Text className="text-center text-xl font-semibold text-gray-700">Bottom Sheet Demo</Text>
          <View className="items-center">
            <Button
              title="Open Bottom Sheet"
              onPress={handleOpenBottomSheet}
              variant="secondary"
              size="lg"
              className="px-8"
            />
          </View>
        </View>

        {/* Feature List using new component */}
        <FeatureList />
      </ScrollView>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleIndicatorStyle={{ backgroundColor: '#D1D5DB' }}
        backgroundStyle={{ backgroundColor: '#FFFFFF' }}>
        <BottomSheetView className="flex-1 p-6">
          <Text className="mb-4 text-center text-2xl font-bold text-gray-800">
            🎉 Bottom Sheet Demo
          </Text>

          <Text className="mb-6 text-center text-gray-600">
            This is a React Native Bottom Sheet with gesture handling. You can drag it up and down,
            or swipe down to close.
          </Text>

          <View className="space-y-4">
            <View className="rounded-lg bg-blue-50 p-4">
              <Text className="mb-2 font-semibold text-blue-800">Snap Points</Text>
              <Text className="text-blue-600">25%, 50%, 90% of screen height</Text>
            </View>

            <View className="rounded-lg bg-green-50 p-4">
              <Text className="mb-2 font-semibold text-green-800">Gestures</Text>
              <Text className="text-green-600">Pan, swipe, and tap gestures supported</Text>
            </View>

            <View className="rounded-lg bg-purple-50 p-4">
              <Text className="mb-2 font-semibold text-purple-800">Backdrop</Text>
              <Text className="text-purple-600">Custom backdrop with opacity animation</Text>
            </View>

            <View className="mt-6 items-center">
              <Button
                title="Close Bottom Sheet"
                onPress={handleCloseBottomSheet}
                variant="danger"
                size="lg"
              />
            </View>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

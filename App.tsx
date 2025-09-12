import React, { useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor,
} from 'react-native-reanimated';
import BottomSheet, { BottomSheetView, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import './global.css';

export default function App() {
  // Reanimated shared values for animations
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const colorProgress = useSharedValue(0);

  // Bottom Sheet ref and snap points
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(() => ['25%', '50%', '90%'], []);

  // Animation functions
  const handleScaleAnimation = () => {
    scale.value = withSequence(
      withTiming(1.3, { duration: 300 }),
      withTiming(1, { duration: 300 })
    );
  };

  const handleRotationAnimation = () => {
    rotation.value = withTiming(rotation.value + 360, { duration: 1000 });
  };

  const handleBounceAnimation = () => {
    translateY.value = withSequence(
      withTiming(-50, { duration: 300 }),
      withSpring(0, { damping: 8, stiffness: 200 })
    );
  };

  const handleShakeAnimation = () => {
    translateX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withRepeat(withTiming(10, { duration: 100 }), 3, true),
      withTiming(0, { duration: 50 })
    );
  };

  const handleFadeAnimation = () => {
    opacity.value = withSequence(
      withTiming(0.2, { duration: 500 }),
      withTiming(1, { duration: 500 })
    );
  };

  const handleColorAnimation = () => {
    colorProgress.value = withTiming(colorProgress.value === 0 ? 1 : 0, { duration: 1000 });
  };

  const handleContinuousRotation = () => {
    rotation.value = withRepeat(withTiming(360, { duration: 2000 }), -1, false);
  };

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
        { scale: scale.value },
        { rotate: `${rotation.value}deg` },
        { translateX: translateX.value },
        { translateY: translateY.value },
      ],
      opacity: opacity.value,
    };
  });

  const colorAnimatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: interpolateColor(colorProgress.value, [0, 1], ['#3B82F6', '#EF4444']),
    };
  });

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaView className="flex-1 bg-gray-100">
          <StatusBar style="auto" />

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

            {/* Animation Controls */}
            <View className="mb-8 space-y-4">
              <Text className="text-center text-xl font-semibold text-gray-700">
                Reanimated Animations
              </Text>

              <View className="flex-row flex-wrap justify-center gap-3">
                <TouchableOpacity
                  onPress={handleScaleAnimation}
                  className="rounded-lg bg-blue-500 px-4 py-2">
                  <Text className="font-semibold text-white">Scale</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleRotationAnimation}
                  className="rounded-lg bg-green-500 px-4 py-2">
                  <Text className="font-semibold text-white">Rotate</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleBounceAnimation}
                  className="rounded-lg bg-purple-500 px-4 py-2">
                  <Text className="font-semibold text-white">Bounce</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleShakeAnimation}
                  className="rounded-lg bg-orange-500 px-4 py-2">
                  <Text className="font-semibold text-white">Shake</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleFadeAnimation}
                  className="rounded-lg bg-indigo-500 px-4 py-2">
                  <Text className="font-semibold text-white">Fade</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleColorAnimation}
                  className="rounded-lg bg-pink-500 px-4 py-2">
                  <Text className="font-semibold text-white">Color</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleContinuousRotation}
                  className="rounded-lg bg-teal-500 px-4 py-2">
                  <Text className="font-semibold text-white">Spin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom Sheet Controls */}
            <View className="space-y-4">
              <Text className="text-center text-xl font-semibold text-gray-700">
                Bottom Sheet Demo
              </Text>

              <TouchableOpacity
                onPress={handleOpenBottomSheet}
                className="mx-8 rounded-lg bg-gray-800 px-6 py-4">
                <Text className="text-center text-lg font-bold text-white">Open Bottom Sheet</Text>
              </TouchableOpacity>
            </View>

            {/* Feature List */}
            <View className="mt-8 rounded-lg bg-white p-4 shadow">
              <Text className="mb-3 text-lg font-semibold text-gray-800">
                Features Demonstrated:
              </Text>
              <Text className="mb-2 text-gray-600">• React Native Reanimated 4.1.0</Text>
              <Text className="mb-2 text-gray-600">
                • Multiple animation types (scale, rotate, bounce, shake, fade)
              </Text>
              <Text className="mb-2 text-gray-600">• Color interpolation animations</Text>
              <Text className="mb-2 text-gray-600">• @gorhom/bottom-sheet integration</Text>
              <Text className="mb-2 text-gray-600">
                • Gesture handling with react-native-gesture-handler
              </Text>
              <Text className="text-gray-600">• NativeWind styling integration</Text>
            </View>
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
                This is a React Native Bottom Sheet with gesture handling. You can drag it up and
                down, or swipe down to close.
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

                <TouchableOpacity
                  onPress={handleCloseBottomSheet}
                  className="mt-6 rounded-lg bg-red-500 px-6 py-3">
                  <Text className="text-center font-bold text-white">Close Bottom Sheet</Text>
                </TouchableOpacity>
              </View>
            </BottomSheetView>
          </BottomSheet>
        </SafeAreaView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

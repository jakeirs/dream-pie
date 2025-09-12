import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';

export default function ExploreScreen() {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  const handlePress = () => {
    scale.value = withSequence(withSpring(1.2), withSpring(1));
    rotate.value = withTiming(rotate.value + 180, { duration: 500 });
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
  }));

  return (
    <View className="flex-1 bg-gray-100">
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Explore Tab</Text>

        <View className="mb-8 items-center">
          <Animated.View
            style={animatedStyle}
            className="h-32 w-32 items-center justify-center rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg">
            <Text className="text-4xl">🌟</Text>
          </Animated.View>
        </View>

        <TouchableOpacity onPress={handlePress} className="mb-8 rounded-lg bg-purple-500 px-6 py-4">
          <Text className="text-center text-lg font-bold text-white">Animate Star!</Text>
        </TouchableOpacity>

        <View className="space-y-4">
          <View className="rounded-lg bg-white p-6 shadow">
            <Text className="mb-3 text-xl font-bold text-gray-800">🚀 Navigation Success!</Text>
            <Text className="text-gray-600">
              You&apos;ve successfully implemented Expo Router with tab navigation. This explore tab
              demonstrates that routing is working perfectly!
            </Text>
          </View>

          <View className="rounded-lg bg-blue-50 p-6">
            <Text className="mb-3 text-lg font-semibold text-blue-800">
              ✅ What&apos;s Working:
            </Text>
            <Text className="mb-2 text-blue-700">• File-based routing</Text>
            <Text className="mb-2 text-blue-700">• Tab navigation</Text>
            <Text className="mb-2 text-blue-700">• Reanimated animations</Text>
            <Text className="mb-2 text-blue-700">• Bottom sheet modals</Text>
            <Text className="text-blue-700">• NativeWind styling</Text>
          </View>

          <View className="rounded-lg bg-green-50 p-6">
            <Text className="mb-3 text-lg font-semibold text-green-800">📱 User Journey:</Text>
            <Text className="mb-2 text-green-700">1. App launches on Home tab</Text>
            <Text className="mb-2 text-green-700">2. All animations work perfectly</Text>
            <Text className="mb-2 text-green-700">3. Bottom sheet opens/closes smoothly</Text>
            <Text className="mb-2 text-green-700">4. Tab switching is seamless</Text>
            <Text className="text-green-700">5. State is preserved across tabs</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

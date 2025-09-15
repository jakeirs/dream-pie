import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export default function ModalScreen() {
  const scale = useSharedValue(0.8)
  const opacity = useSharedValue(0)

  React.useEffect(() => {
    scale.value = withSpring(1)
    opacity.value = withTiming(1, { duration: 300 })
  }, [scale, opacity])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }))

  const handleClose = () => {
    scale.value = withSpring(0.8)
    opacity.value = withTiming(0, { duration: 200 })
    setTimeout(() => router.back(), 200)
  }

  return (
    <View className="flex-1 items-center justify-center bg-black/50 px-6">
      <Animated.View
        style={animatedStyle}
        className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
        <View className="mb-6 items-center">
          <Text className="mb-4 text-4xl">🎉</Text>
          <Text className="mb-2 text-center text-2xl font-bold text-gray-800">Modal Screen</Text>
          <Text className="text-center text-gray-600">
            This is a modal presented using Expo Router!
          </Text>
        </View>

        <View className="mb-6 space-y-3">
          <View className="rounded-lg bg-blue-50 p-4">
            <Text className="text-sm font-semibold text-blue-800">Navigation Type</Text>
            <Text className="text-blue-600">Stack Modal Presentation</Text>
          </View>

          <View className="rounded-lg bg-green-50 p-4">
            <Text className="text-sm font-semibold text-green-800">Animation</Text>
            <Text className="text-green-600">Custom entrance/exit animations</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleClose} className="rounded-lg bg-red-500 px-6 py-3">
          <Text className="text-center font-bold text-white">Close Modal</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  )
}

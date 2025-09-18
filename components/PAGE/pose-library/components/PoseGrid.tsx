// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, TouchableOpacity, Pressable } from 'react-native'
import { useEffect } from 'react'

// 2. Third-party libraries
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  interpolate,
} from 'react-native-reanimated'

// 3. UI components (@/components/ui)
import CustomImage from '@/components/ui/CustomImage/CustomImage'

// 4. Theme imports
import { brandColors } from '@/shared/theme'

// 5. Constants, Types, Mock Data
import { usePoseStore } from '@/stores'
import { mockPoses } from '@/mockData/dream/poses'
import { Pose } from '@/types/dream/pose'

// Animated Pose Card Component
const AnimatedPoseCard = ({
  pose,
  isSelected,
  onPress,
}: {
  pose: Pose
  isSelected: boolean
  onPress: () => void
}) => {
  const borderWidth = useSharedValue(0)

  useEffect(() => {
    if (isSelected) {
      borderWidth.value = withTiming(3, { duration: 200 })
    } else {
      borderWidth.value = withTiming(0, { duration: 200 })
    }
  }, [isSelected])

  const borderStyle = useAnimatedStyle(() => ({
    borderWidth: borderWidth.value,
    borderColor: '#3B82F6', // Blue border
  }))

  return (
    <Pressable onPress={onPress}>
      <Animated.View
        className="bg-surface overflow-hidden rounded-xl shadow-sm"
        style={[borderStyle]}>
        <CustomImage source={pose.imageUrl} width="100%" height={120} borderRadius={12} />

        {/* Premium Badge */}
        {pose.isPremium && (
          <View className="absolute right-2 top-2 rounded bg-warning px-2 py-1">
            <Text className="text-xs font-bold text-white">👑 PRO</Text>
          </View>
        )}

        {/* Title and Subtitle */}
        <View className="p-3">
          <Text
            className="text-sm font-medium"
            style={{ color: brandColors.textPrimary }}
            numberOfLines={1}>
            {pose.name}
          </Text>
          <Text className="text-xs" style={{ color: brandColors.textSecondary }} numberOfLines={1}>
            {pose.category.charAt(0).toUpperCase() + pose.category.slice(1)}
          </Text>
        </View>
      </Animated.View>
    </Pressable>
  )
}

export const PoseGrid = () => {
  const { setSelectedPose, selectedPose, poses, setPoses } = usePoseStore()

  // Load poses on mount if empty
  useEffect(() => {
    if (poses.length === 0) {
      setPoses(mockPoses)
    }
  }, [poses.length, setPoses])

  // Safety check for poses array
  if (!poses || poses.length === 0) {
    return (
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-center text-textSecondary">Loading poses...</Text>
      </View>
    )
  }
  return (
    <View className="flex-row flex-wrap p-4">
      {poses.map((pose, index) => {
        const isSelected = selectedPose?.id === pose.id

        return (
          <View key={pose.id} className="w-1/3 p-2">
            <AnimatedPoseCard
              pose={pose}
              isSelected={isSelected}
              onPress={() => setSelectedPose(pose)}
            />
          </View>
        )
      })}
    </View>
  )
}

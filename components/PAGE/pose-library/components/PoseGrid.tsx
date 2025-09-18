// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, TouchableOpacity } from 'react-native'

// 2. UI components (@/components/ui)
import CustomImage from '@/components/ui/CustomImage/CustomImage'

// 3. Theme imports
import { brandColors } from '@/shared/theme'

// 4. Constants, Types, Mock Data
import { PoseGridProps } from '../types'

export const PoseGrid = ({ poses, selectedPose, onPoseSelect, subscription }: PoseGridProps) => {
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
        // Safety check for individual pose objects
        if (!pose || !pose.id) {
          return null
        }

        const isSelected = selectedPose?.id === pose.id

        return (
          <View key={pose.id} className="w-1/3 p-2">
            <TouchableOpacity onPress={() => {}} activeOpacity={0.8}>
              <View
                className={`bg-surface overflow-hidden rounded-xl shadow-sm ${isSelected ? 'border-2 border-primary' : ''}`}>
                <CustomImage
                  index={index}
                  source={pose.imageUrl}
                  width="100%"
                  height={120}
                  borderRadius={12}
                />

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
                  <Text
                    className="text-xs"
                    style={{ color: brandColors.textSecondary }}
                    numberOfLines={1}>
                    {pose.category.charAt(0).toUpperCase() + pose.category.slice(1)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )
      })}
    </View>
  )
}

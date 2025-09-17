// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. UI components (@/components/ui)
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 3. Constants, Types, Mock Data
import { Pose } from '@/types/dream'
import { PoseGridProps } from '../types'

export const PoseGrid = ({ poses, selectedPose, onPoseSelect, subscription }: PoseGridProps) => {
  return (
    <View className="flex-row flex-wrap p-4">
      {poses.map((pose) => {
        const isSelected = selectedPose?.id === pose.id
        const needsPremium = pose.isPremium && subscription.tier === 'free'

        return (
          <View key={pose.id} className="w-1/3 p-2">
            <Thumbnail
              imageUrl={pose.imageUrl}
              title={pose.name}
              subtitle={pose.category.charAt(0).toUpperCase() + pose.category.slice(1)}
              isSelected={isSelected}
              isPremium={pose.isPremium}
              isLocked={needsPremium}
              onPress={() => onPoseSelect(pose)}
              aspectRatio={0.75}
            />
          </View>
        )
      })}
    </View>
  )
}

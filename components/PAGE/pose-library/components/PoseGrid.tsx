// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. UI components (@/components/ui)
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 3. Constants, Types, Mock Data
import { Pose } from '@/types/dream'
import { PoseGridProps } from '../types'

export const PoseGrid = ({ poses, selectedPose, onPoseSelect, subscription }: PoseGridProps) => {
  const renderPose = (item: Pose) => {
    const isSelected = selectedPose?.id === item.id
    const needsPremium = item.isPremium && subscription.tier === 'free'

    return (
      <View key={item.id} className="w-1/2 p-2">
        <Thumbnail
          imageUrl={item.imageUrl}
          title={item.name}
          subtitle={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
          isSelected={isSelected}
          isPremium={item.isPremium}
          isLocked={needsPremium}
          onPress={() => onPoseSelect(item)}
          aspectRatio={0.75}
        />
      </View>
    )
  }

  return (
    <View className="flex-row flex-wrap p-4">
      {poses.map((pose) => renderPose(pose))}
    </View>
  )
}
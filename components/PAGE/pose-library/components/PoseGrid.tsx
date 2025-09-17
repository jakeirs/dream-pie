// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { FlatList } from 'react-native'

// 2. UI components (@/components/ui)
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 3. Constants, Types, Mock Data
import { Pose } from '@/types/dream'
import { PoseGridProps } from '../types'

export const PoseGrid = ({ poses, selectedPose, onPoseSelect, subscription }: PoseGridProps) => {
  const renderPose = ({ item }: { item: Pose }) => {
    const isSelected = selectedPose?.id === item.id
    const needsPremium = item.isPremium && subscription.tier === 'free'

    return (
      <Thumbnail
        imageUrl={item.imageUrl}
        title={item.name}
        subtitle={item.category.charAt(0).toUpperCase() + item.category.slice(1)}
        isSelected={isSelected}
        isPremium={item.isPremium}
        isLocked={needsPremium}
        onPress={() => onPoseSelect(item)}
        aspectRatio={0.75}
        className="m-2 flex-1"
      />
    )
  }

  return (
    <FlatList
      data={poses}
      renderItem={renderPose}
      numColumns={2}
      contentContainerStyle={{ padding: 16 }}
      keyExtractor={(item) => item.id}
      showsVerticalScrollIndicator={false}
    />
  )
}
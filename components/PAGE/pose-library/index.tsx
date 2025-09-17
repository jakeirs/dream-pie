// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. Same tree components (local to current page)
import { PoseGrid, PoseHeader, ThumbnailExamples } from './components'

// 3. Hooks
import { usePoseLibrary } from './hooks'

// 4. Constants, Types, Mock Data
import { PoseLibraryPageProps } from './types'

export default function PoseLibraryPage({ onClose }: PoseLibraryPageProps) {
  const { poses, selectedPose, subscription, handlePoseSelect } = usePoseLibrary(onClose)

  return (
    <View className="flex-1 bg-background">
      <PoseHeader onClose={onClose} />
      <ThumbnailExamples />
      <PoseGrid
        poses={poses}
        selectedPose={selectedPose}
        onPoseSelect={handlePoseSelect}
        subscription={subscription}
      />
    </View>
  )
}

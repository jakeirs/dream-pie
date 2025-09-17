// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. UI components (@/components/ui)
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

// 3. Stores with inline selector for performance
import { useStore, useNavigationStore } from '@/stores'

interface PhotoCardGridProps {}

const PhotoCardGrid = ({}: PhotoCardGridProps) => {
  // ✅ Optimized: Only subscribe to poseLibraryRef changes
  const poseLibraryRef = useStore(useNavigationStore, (state) => state.poseLibraryRef)

  const handleSelfiePress = () => {
    console.log('Selfie card pressed')
  }

  const handlePosePress = () => {
    poseLibraryRef?.current?.snapToIndex(1)
  }

  return (
    <View className="flex-row gap-2 px-2">
      <View className="flex-1">
        <PhotoCard title="Your Selfie" onClickCard={handleSelfiePress} />
      </View>
      <View className="flex-1">
        <PhotoCard title="Your Pose" onClickCard={handlePosePress} />
      </View>
    </View>
  )
}

export default PhotoCardGrid

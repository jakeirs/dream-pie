// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. UI components (@/components/ui)
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

// 3. Stores with inline selector for performance
import { useStore, useNavigationStore, usePoseStore } from '@/stores'

// 4. Assets
import { appAssets } from '@/shared/assets/assets'

interface PhotoCardGridProps {}

const PhotoCardGrid = ({}: PhotoCardGridProps) => {
  // ✅ Optimized: Only subscribe to specific store properties to avoid unnecessary re-renders
  const poseLibraryRef = useStore(useNavigationStore, (state) => state.poseLibraryRef)
  const selfieChooserRef = useStore(useNavigationStore, (state) => state.selfieChooserRef)
  const selectedPose = usePoseStore((state) => state.selectedPose)
  const handleSelfiePress = () => {
    selfieChooserRef?.current?.snapToIndex(1)
  }

  const handlePosePress = () => {
    poseLibraryRef?.current?.snapToIndex(1)
  }

  return (
    <View className="flex-row gap-2 px-2">
      <View className="flex-1">
        <PhotoCard
          title="Your Selfie"
          onClickCard={handleSelfiePress}
          imageSource={appAssets.selfies.extendPhoto} // Default selfie photo using appAssets
        />
      </View>
      <View className="flex-1">
        <PhotoCard
          title="Your Pose"
          onClickCard={handlePosePress}
          imageSource={selectedPose?.imageUrl ?? appAssets.selfies.extendPhoto} // Dynamic pose image path from Zustand (now string)
        />
      </View>
    </View>
  )
}

export default PhotoCardGrid

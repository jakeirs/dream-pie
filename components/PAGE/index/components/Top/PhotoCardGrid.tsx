import { View } from 'react-native'

import { PhotoCard } from '@/components/ui/PhotoCard/PhotoCard'

import { useStore, useNavigationStore, usePoseStore, useSelfieChooserStore } from '@/stores'
import { appAssets } from '@/shared/assets/assets'

interface PhotoCardGridProps {}

const PhotoCardGrid = ({}: PhotoCardGridProps) => {
  // ✅ Optimized: Only subscribe to specific store properties to avoid unnecessary re-renders
  const poseLibraryRef = useStore(useNavigationStore, (state) => state.poseLibraryRef)
  const selfieChooserRef = useStore(useNavigationStore, (state) => state.selfieChooserRef)
  const selectedPose = usePoseStore((state) => state.selectedPose)
  const selectedSelfie = useSelfieChooserStore((state) => state.selectedSelfie)
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
          imageSource={selectedSelfie?.imageUrl ?? appAssets.selfies.extendPhoto} // Default selfie photo using appAssets
        />
      </View>
      <View className="flex-1">
        <PhotoCard
          title="Your Pose"
          onClickCard={handlePosePress}
          imageSource={selectedPose?.imageUrl ?? appAssets.poses.dress} // Dynamic pose image path from Zustand (now string)
        />
      </View>
    </View>
  )
}

export default PhotoCardGrid

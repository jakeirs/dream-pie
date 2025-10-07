import { View } from 'react-native'

import { PhotoCard } from '@/components/ui/PhotoCard/PhotoCard'

import { useStore, useNavigationStore, usePoseStore, useSelfieChooserStore } from '@/stores'

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
          type="selfie"
          onClickCard={handleSelfiePress}
          imageSource={selectedSelfie?.imageUrl} // Empty state shown when undefined
        />
      </View>
      <View className="flex-1">
        <PhotoCard
          title="Your Pose"
          type="pose"
          onClickCard={handlePosePress}
          imageSource={selectedPose?.imageUrl} // Empty state shown when undefined
        />
      </View>
    </View>
  )
}

export default PhotoCardGrid

// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View } from 'react-native'

// 2. UI components (@/components/ui)
import PhotoCard from '@/components/ui/PhotoCard/PhotoCard'

interface PhotoCardGridProps {
  onPosePress?: () => void
}

const PhotoCardGrid = ({ onPosePress }: PhotoCardGridProps) => {
  const handleSelfiePress = () => {
    console.log('Selfie card pressed')
  }

  const handlePosePress = () => {
    if (onPosePress) {
      onPosePress()
    } else {
      console.log('Pose card pressed - no handler provided')
    }
  }

  return (
    <View className="flex-row gap-2 px-2">
      <View className="flex-1">
        <PhotoCard
          title="Your Selfie"
          onClickCard={handleSelfiePress}
        />
      </View>
      <View className="flex-1">
        <PhotoCard
          title="Your Pose"
          onClickCard={handlePosePress}
        />
      </View>
    </View>
  )
}

export default PhotoCardGrid
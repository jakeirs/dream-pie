// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'
import { router } from 'expo-router'

// 5. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 6. Hooks
import { usePoseStore } from '@/stores/poseStore'

// 7. Constants, Types, Mock Data
import { brandColors } from '@/shared/theme'

interface BottomProps {}

export function Bottom({}: BottomProps) {
  const { selectedPose, setSelectedPose, poses } = usePoseStore()

  const handlePoseSelect = (poseId: string) => {
    const selectedPoseData = poses.find((pose) => pose.id === poseId)
    setSelectedPose(selectedPoseData || null)
  }

  return (
    <>
      <View className="flex-1">
        {/* Pose Thumbnails Section */}
        <View className="mb-6 px-6">
          <Text className="mb-4 text-lg font-semibold" style={{ color: brandColors.textPrimary }}>
            Choose a Pose Style
          </Text>

          {/* Thumbnail Grid */}
          <View className="flex-row justify-between gap-3">
            {poses.map((pose) => (
              <View key={pose.id} className="flex-1">
                <Thumbnail
                  imageUrl={pose.imageUrl}
                  title={pose.name}
                  subtitle={pose.description}
                  isSelected={selectedPose?.id === pose.id}
                  isPremium={pose.isPremium}
                  aspectRatio={1.2}
                  onPress={() => handlePoseSelect(pose.id)}
                />
              </View>
            ))}
          </View>
        </View>

        {/* Generate Photo Button */}
        <View className="mb-8 px-6">
          <Button
            onPress={() => router.push('/(creation)/generation')}
            className="w-full"
            style={{
              backgroundColor: brandColors.success,
              paddingVertical: 24,
            }}>
            <Text className="text-xl font-bold" style={{ color: brandColors.primaryForeground }}>
              🎨 Generate Photo →
            </Text>
          </Button>
        </View>
      </View>
    </>
  )
}

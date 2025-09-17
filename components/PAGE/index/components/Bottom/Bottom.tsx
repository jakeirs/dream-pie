import { View, Text } from 'react-native'
import { Button } from '@/components/ui'
import { router } from 'expo-router'
import { brandColors } from '@/shared/theme'

interface BottomProps {
  onPoseChange: () => void
}

export function Bottom({ onPoseChange }: BottomProps) {
  return (
    <>
      <View className="flex-1">
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

      {/* Pose Library Button */}
      <View className="border-t border-borderLight bg-background">
        <View className="px-6 py-6">
          <Button
            onPress={onPoseChange}
            className="w-full"
            style={{
              backgroundColor: brandColors.warning,
              paddingVertical: 18,
            }}>
            <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
              Choose Pose
            </Text>
          </Button>
        </View>
      </View>
    </>
  )
}

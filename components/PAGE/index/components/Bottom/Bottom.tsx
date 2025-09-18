// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'

// 5. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 6. Hooks
import { usePoseStore } from '@/stores/poseStore'

// 7. Constants, Types, Mock Data
import { brandColors } from '@/shared/theme'
import { mockPoses } from '@/mockData/dream/poses'
import { Image } from 'expo-image'

interface BottomProps {}

export function Bottom({}: BottomProps) {
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
    </>
  )
}

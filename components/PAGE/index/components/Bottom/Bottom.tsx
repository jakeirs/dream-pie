import { View, Text } from 'react-native'
import { router } from 'expo-router'

// 5. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'

// 7. Constants, Types, Mock Data
import { brandColors } from '@/shared/theme'

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
              backgroundColor: brandColors.primary,
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

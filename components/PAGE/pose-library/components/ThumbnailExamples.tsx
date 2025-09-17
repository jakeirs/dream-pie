// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, ScrollView } from 'react-native'

// 2. UI components (@/components/ui)
import Thumbnail from '@/components/ui/Thumbnail/Thumbnail'

// 3. Theme imports
import { brandColors } from '@/shared/theme'

export const ThumbnailExamples = () => {
  // Example data for different thumbnail variations
  // Use local images to match the pose data format
  const exampleImage = require('@/assets/poses/From-top.jpg')
  const landscapeImage = require('@/assets/poses/dress.jpg')

  const handlePress = (variant: string) => {
    console.log(`Pressed ${variant} thumbnail`)
  }

  return (
    <View className="p-4">
      <Text
        className="text-lg font-bold mb-4"
        style={{ color: brandColors.textPrimary }}>
        Thumbnail Variations
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {/* Standard Thumbnail */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Standard
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Standard Pose"
            subtitle="Casual"
            onPress={() => handlePress('standard')}
            aspectRatio={0.75}
          />
        </View>

        {/* Selected Thumbnail */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Selected
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Selected Pose"
            subtitle="Professional"
            isSelected={true}
            onPress={() => handlePress('selected')}
            aspectRatio={0.75}
          />
        </View>

        {/* Premium Thumbnail */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Premium
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Premium Pose"
            subtitle="Fashion"
            isPremium={true}
            onPress={() => handlePress('premium')}
            aspectRatio={0.75}
          />
        </View>

        {/* Locked Premium Thumbnail */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Locked
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Locked Pose"
            subtitle="Creative"
            isPremium={true}
            isLocked={true}
            onPress={() => handlePress('locked')}
            aspectRatio={0.75}
          />
        </View>

        {/* Wide Aspect Ratio */}
        <View className="mr-4 w-40">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Wide (16:9)
          </Text>
          <Thumbnail
            imageUrl={landscapeImage}
            title="Landscape"
            subtitle="Travel"
            aspectRatio={16/9}
            onPress={() => handlePress('wide')}
          />
        </View>

        {/* Square Aspect Ratio */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Square (1:1)
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Square"
            subtitle="Fitness"
            aspectRatio={1}
            onPress={() => handlePress('square')}
          />
        </View>

        {/* Without Subtitle */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            No Subtitle
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Simple Pose"
            onPress={() => handlePress('no-subtitle')}
            aspectRatio={0.75}
          />
        </View>

        {/* Custom Class Names */}
        <View className="mr-4 w-32">
          <Text
            className="text-sm font-medium mb-2"
            style={{ color: brandColors.textSecondary }}>
            Custom Style
          </Text>
          <Thumbnail
            imageUrl={exampleImage}
            title="Styled Pose"
            subtitle="Custom"
            onPress={() => handlePress('custom')}
            aspectRatio={0.75}
            className="shadow-lg border-2 border-opacity-20"
          />
        </View>
      </ScrollView>
    </View>
  )
}
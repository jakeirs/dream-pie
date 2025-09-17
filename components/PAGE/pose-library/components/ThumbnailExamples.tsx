// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'

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

  const examples = [
    {
      title: 'Standard',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Standard Pose"
          subtitle="Casual"
          onPress={() => handlePress('standard')}
          aspectRatio={0.75}
        />
      ),
    },
    {
      title: 'Selected',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Selected Pose"
          subtitle="Professional"
          isSelected={true}
          onPress={() => handlePress('selected')}
          aspectRatio={0.75}
        />
      ),
    },
    {
      title: 'Premium',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Premium Pose"
          subtitle="Fashion"
          isPremium={true}
          onPress={() => handlePress('premium')}
          aspectRatio={0.75}
        />
      ),
    },
    {
      title: 'Locked',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Locked Pose"
          subtitle="Creative"
          isPremium={true}
          isLocked={true}
          onPress={() => handlePress('locked')}
          aspectRatio={0.75}
        />
      ),
    },
    {
      title: 'Wide (16:9)',
      thumbnail: (
        <Thumbnail
          imageUrl={landscapeImage}
          title="Landscape"
          subtitle="Travel"
          aspectRatio={16 / 9}
          onPress={() => handlePress('wide')}
        />
      ),
      isWide: true,
    },
    {
      title: 'Square (1:1)',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Square"
          subtitle="Fitness"
          aspectRatio={1}
          onPress={() => handlePress('square')}
        />
      ),
    },
    {
      title: 'No Subtitle',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Simple Pose"
          onPress={() => handlePress('no-subtitle')}
          aspectRatio={0.75}
        />
      ),
    },
    {
      title: 'Custom Style',
      thumbnail: (
        <Thumbnail
          imageUrl={exampleImage}
          title="Styled Pose"
          subtitle="Custom"
          onPress={() => handlePress('custom')}
          aspectRatio={0.75}
          className="border-2 border-opacity-20 shadow-lg"
        />
      ),
    },
  ]

  return (
    <View className="p-4">
      <Text className="mb-4 text-lg font-bold" style={{ color: brandColors.textPrimary }}>
        Thumbnail Variations
      </Text>

      <View className="-mx-2 flex-row flex-wrap">
        {examples.map((example, index) => (
          <View key={index} className={`mb-4 px-2 ${example.isWide ? 'w-2/5' : 'w-1/3'}`}>
            <Text className="mb-2 text-sm font-medium" style={{ color: brandColors.textSecondary }}>
              {example.title}
            </Text>
            {example.thumbnail}
          </View>
        ))}
      </View>
    </View>
  )
}

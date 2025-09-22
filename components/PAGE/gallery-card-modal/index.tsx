import { View, Text } from 'react-native'
import { Image } from 'expo-image'

import Button from '@/components/ui/Button/Button'

import { brandColors } from '@/shared/theme'

interface GalleryCardModalProps {
  imageUri: string
  title: string
  description?: string
  onClose: () => void
}

export default function GalleryCardModal({
  imageUri,
  title,
  description,
  onClose,
}: GalleryCardModalProps) {
  return (
    <View className="flex-1 px-6 py-4">
      {/* Header */}
      <Text className="mb-6 text-center text-2xl font-bold text-textPrimary">{title}</Text>

      {/* Image */}
      <View className="mb-6 items-center">
        {imageUri && (
          <Image
            source={imageUri}
            style={{
              width: 280,
              height: 350,
              borderRadius: 16,
            }}
            contentFit="cover"
          />
        )}
      </View>

      {/* Description */}
      {description && (
        <View className="mb-6 rounded-xl bg-cardSecondary p-4">
          <Text className="text-textSecondary">{description}</Text>
        </View>
      )}

      {/* Details */}
      <View className="mb-6 rounded-xl bg-cardSecondary p-4">
        <Text className="mb-2 text-lg font-bold text-textPrimary">Photo Details</Text>
        <Text className="text-textSecondary">
          • Created with Dream Pie AI{'\n'}• Professional quality enhancement{'\n'}• Background
          replacement applied{'\n'}• Color grading optimized
        </Text>
      </View>

      {/* Close Button */}
      <Button
        onPress={onClose}
        className="w-full"
        style={{
          backgroundColor: brandColors.primary,
          paddingVertical: 18,
        }}>
        <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
          Close
        </Text>
      </Button>
    </View>
  )
}

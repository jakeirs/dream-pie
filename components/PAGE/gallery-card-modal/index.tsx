import { View, Text, ActivityIndicator } from 'react-native'
import { Image } from 'expo-image'

import Button from '@/components/ui/Button/Button'

import { useImageShare } from '@/hooks/useImageShare'
import { brandColors } from '@/shared/theme'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { Icon } from '@/components/ui/icons'

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
  const { shareImage, isSharing } = useImageShare()

  const handleShare = async () => {
    await shareImage(imageUri, title)
  }
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

      {/* Action Buttons */}
      <View className="flex-row gap-3">
        {/* Share Button */}
        <Button
          onPress={handleShare}
          disabled={isSharing}
          className="flex-1"
          style={{
            backgroundColor: isSharing ? brandColors.accent : brandColors.success,
            paddingVertical: 18,
          }}>
          <View className="flex-row items-center justify-center gap-2">
            {isSharing ? (
              <ActivityIndicator size="small" color={brandColors.successForeground} />
            ) : (
              <Icon
                family={ICON_FAMILY_NAME.Feather}
                name="share"
                size={20}
                color={brandColors.successForeground}
              />
            )}
            <Text className="text-lg font-bold" style={{ color: brandColors.successForeground }}>
              {isSharing ? 'Preparing...' : 'Share'}
            </Text>
          </View>
        </Button>

        {/* Close Button */}
        <Button
          onPress={onClose}
          className="flex-1"
          style={{
            backgroundColor: brandColors.primary,
            paddingVertical: 18,
          }}>
          <Text className="text-lg font-bold" style={{ color: brandColors.primaryForeground }}>
            Close
          </Text>
        </Button>
      </View>
    </View>
  )
}

import { View, TouchableOpacity, Text } from 'react-native'

import Alert from '@/components/ui/Alert/Alert'
import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

import { useCameraButton } from './hooks/useCameraButton'
import { brandColors } from '@/shared/theme/colors'
import { Selfie } from '@/types/dream/selfie'

interface CameraButtonProps {
  onPhotoSelected: (selfie: Selfie) => void
}

export default function CameraButton({ onPhotoSelected }: CameraButtonProps) {
  const {
    isLoading,
    showAlert,
    showImagePicker,
    hideAlert,
    handleCameraPress,
    handleGalleryPress,
  } = useCameraButton({ onPhotoSelected })

  return (
    <>
      <View className="aspect-square w-full p-1">
        <TouchableOpacity
          className="flex-1 items-center justify-center rounded-lg"
          style={{ backgroundColor: brandColors.primary }}
          onPress={showImagePicker}
          disabled={isLoading}
          activeOpacity={0.8}>
          <Icon
            family={ICON_FAMILY_NAME.Feather}
            name="camera"
            size={32}
            color={brandColors.primaryForeground}
          />
        </TouchableOpacity>
      </View>

      <Alert
        visible={showAlert}
        onClose={hideAlert}
        title="Select Photo">
        <View className="space-y-3">
          <Text
            className="text-base text-center mb-4"
            style={{ color: brandColors.textSecondary }}>
            Choose how you want to add a photo
          </Text>

          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-6 rounded-xl"
            style={{ backgroundColor: brandColors.primary }}
            onPress={handleCameraPress}
            disabled={isLoading}
            activeOpacity={0.8}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="camera"
              size={24}
              color={brandColors.primaryForeground}
            />
            <Text
              className="ml-3 text-lg font-semibold"
              style={{ color: brandColors.primaryForeground }}>
              Camera
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex-row items-center justify-center py-4 px-6 rounded-xl"
            style={{ backgroundColor: brandColors.accent }}
            onPress={handleGalleryPress}
            disabled={isLoading}
            activeOpacity={0.8}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="image"
              size={24}
              color={brandColors.accentForeground}
            />
            <Text
              className="ml-3 text-lg font-semibold"
              style={{ color: brandColors.accentForeground }}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
      </Alert>
    </>
  )
}

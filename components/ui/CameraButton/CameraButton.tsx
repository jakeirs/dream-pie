import { View, TouchableOpacity, Text } from 'react-native'

import Alert from '@/components/ui/Alert/Alert'
import { Icon } from '@/components/ui/icons/Icon'
import { GradientIcon } from '@/components/ui/icons/GradientIcon'
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
            name={'camera'}
            size={32}
            color={brandColors.primaryForeground}
          />
        </TouchableOpacity>
      </View>

      <Alert visible={showAlert} onClose={hideAlert} title="Select Photo">
        <View className="space-y-3">
          <Text className="mb-4 text-center text-base" style={{ color: brandColors.textSecondary }}>
            {'Choose how you want to add a photo'}
          </Text>

          {/* Guidelines Section */}
          <View className="mb-6 px-2">
            <View className="mb-2 flex-row">
              <View className="mr-3">
                <GradientIcon
                  family={ICON_FAMILY_NAME.Ionicons}
                  name="camera-outline"
                  size={20}
                  gradientColors={['#A78BFA', '#EC4899']}
                  gradientId="gradient-rule-1"
                />
              </View>
              <Text
                className="flex-1 text-sm font-light"
                style={{ color: brandColors.textSecondary }}>
                Front-facing or slight profile angle works best
              </Text>
            </View>

            <View className="mb-2 flex-row items-center">
              <View className="mr-3">
                <GradientIcon
                  family={ICON_FAMILY_NAME.Ionicons}
                  name="person-circle-outline"
                  size={20}
                  gradientColors={['#A78BFA', '#EC4899']}
                  gradientId="gradient-rule-2"
                />
              </View>
              <Text
                className="flex-1 text-sm font-light"
                style={{ color: brandColors.textSecondary }}>
                Your face appears on the final photo
              </Text>
            </View>

            <View className="mb-2 flex-row items-center">
              <View className="mr-3">
                <GradientIcon
                  family={ICON_FAMILY_NAME.Ionicons}
                  name="shield-checkmark-outline"
                  size={20}
                  gradientColors={['#A78BFA', '#EC4899']}
                  gradientId="gradient-rule-3"
                />
              </View>
              <Text
                className="flex-1 text-sm font-light"
                style={{ color: brandColors.textSecondary }}>
                Photos stay private on your device
              </Text>
            </View>
          </View>

          <TouchableOpacity
            className="mb-4 flex-row items-center justify-center rounded-xl px-6 py-4"
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
            className="flex-row items-center justify-center rounded-xl px-6 py-4"
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

import { View, Text } from 'react-native'

import Button from '@/components/ui/Button/Button'
import { PoseIcon } from '@/components/ui/icons/custom/PoseIcon'

import { brandColors } from '@/shared/theme'

interface PoseHeaderProps {
  onClose: () => void
}

export const PoseHeader = ({ onClose }: PoseHeaderProps) => {
  return (
    <View
      className="flex-row items-center justify-between p-6"
      style={{ borderBottomWidth: 1, borderBottomColor: brandColors.borderLight }}>
      <View className="flex-row items-center gap-3">
        <PoseIcon
          size={55}
          primaryColor={brandColors.background}
          secondaryColor={brandColors.primaryForeground}
        />
        <Text className="text-xl font-bold" style={{ color: brandColors.textLight }}>
          Choose a Pose
        </Text>
      </View>
      <Button variant="secondary" size="small" onPress={onClose}>
        <Text style={{ color: brandColors.textPrimary }}>Done</Text>
      </Button>
    </View>
  )
}

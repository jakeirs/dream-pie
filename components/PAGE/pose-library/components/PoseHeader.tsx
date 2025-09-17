// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'

// 2. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'

// 3. Theme imports
import { brandColors } from '@/shared/theme'

interface PoseHeaderProps {
  onClose: () => void
}

export const PoseHeader = ({ onClose }: PoseHeaderProps) => {
  return (
    <View
      className="flex-row items-center justify-between p-6"
      style={{ borderBottomWidth: 1, borderBottomColor: brandColors.borderLight }}>
      <Text
        className="text-xl font-bold"
        style={{ color: brandColors.textPrimary }}>
        Choose a Pose
      </Text>
      <Button variant="secondary" size="small" onPress={onClose}>
        <Text style={{ color: brandColors.textPrimary }}>Done</Text>
      </Button>
    </View>
  )
}
import { TouchableOpacity } from 'react-native'

import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

import { brandColors } from '@/shared/theme'

interface ButtonExitProps {
  onPress: () => void
  disabled?: boolean
  size?: number
  iconName?: string
  backgroundColor?: string
  iconColor?: string
}

export default function ButtonExit({
  onPress,
  disabled = false,
  size = 40,
  iconName = 'x',
  backgroundColor = brandColors.card,
  iconColor = brandColors.textPrimary,
}: ButtonExitProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor,
        borderRadius: 20,
        width: size,
        height: size,
        alignItems: 'center',
        justifyContent: 'center',
        opacity: disabled ? 0.6 : 1,
      }}>
      <Icon
        family={ICON_FAMILY_NAME.Feather}
        name={iconName}
        size={20}
        color={iconColor}
      />
    </TouchableOpacity>
  )
}
import { View, Text, TouchableOpacity } from 'react-native'

import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

import { brandColors } from '@/shared/theme'

interface ButtonDeleteProps {
  onPress: () => void
  disabled?: boolean
  deleteMode?: boolean
  selectedCount?: number
  isDeleting?: boolean
}

export default function ButtonDelete({
  onPress,
  disabled = false,
  deleteMode = false,
  selectedCount = 0,
  isDeleting = false,
}: ButtonDeleteProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className="relative"
      style={{
        backgroundColor: deleteMode ? brandColors.error : brandColors.card,
        borderRadius: 20,
        borderWidth: deleteMode ? 2 : 0,
        borderColor: deleteMode ? brandColors.errorForeground : 'transparent',
        paddingHorizontal: deleteMode && isDeleting ? 12 : 12,
        paddingVertical: 8,
        minWidth: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 6,
      }}>
      {deleteMode && (
        <Text
          style={{
            color: brandColors.textLight,
            fontSize: 12,
            fontWeight: '600',
          }}>
          deleting...
        </Text>
      )}
      <Icon
        family={ICON_FAMILY_NAME.Feather}
        name="trash-2"
        size={20}
        color={deleteMode ? brandColors.errorForeground : brandColors.error}
      />
      {selectedCount >= 0 && deleteMode && (
        <View
          style={{
            position: 'absolute',
            top: -5,
            right: -5,
            backgroundColor: deleteMode ? brandColors.textLight : brandColors.error,
            borderRadius: 10,
            width: 20,
            height: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              color: deleteMode ? brandColors.error : brandColors.errorForeground,
              fontSize: 12,
              fontWeight: 'bold',
            }}>
            {selectedCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  )
}
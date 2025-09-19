// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, TouchableOpacity } from 'react-native'

// 2. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'
import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

// 3. Hooks
import { useSelfieHeader } from './hooks/useSelfieHeader'

// 4. Store imports
import { useSelfieChooserStore } from '@/stores'

// 5. Theme imports
import { brandColors } from '@/shared/theme'

interface SelfieHeaderProps {
  onClose: () => void
}

export const SelfieHeader = ({ onClose }: SelfieHeaderProps) => {
  const { deleteMode, selectedToDelete } = useSelfieChooserStore()
  const { isDeleting, handleDeletePress, handleCancelDelete } = useSelfieHeader()

  return (
    <View
      className="flex-row items-center justify-between p-6"
      style={{ borderBottomWidth: 1, borderBottomColor: brandColors.borderLight }}>
      <Text className="text-xl font-bold" style={{ color: brandColors.textLight }}>
        Choose a Selfie
      </Text>

      <View className="flex-row items-center gap-3">
        {/* Delete Button */}
        <TouchableOpacity
          onPress={handleDeletePress}
          disabled={isDeleting}
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
          {selectedToDelete.length >= 0 && deleteMode && (
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
                {selectedToDelete.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Done/Cancel Button */}
        {deleteMode ? (
          <TouchableOpacity
            onPress={handleCancelDelete}
            style={{
              backgroundColor: brandColors.card,
              borderRadius: 20,
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="x"
              size={20}
              color={brandColors.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <Button variant="secondary" size="small" onPress={onClose}>
            <Text style={{ color: brandColors.textPrimary }}>Done</Text>
          </Button>
        )}
      </View>
    </View>
  )
}

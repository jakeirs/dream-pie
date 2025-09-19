// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text } from 'react-native'

// 2. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'
import ButtonDelete from '@/components/ui/ButtonDelete/ButtonDelete'
import ButtonExit from '@/components/ui/ButtonExit/ButtonExit'

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
        <ButtonDelete
          onPress={handleDeletePress}
          disabled={isDeleting}
          deleteMode={deleteMode}
          selectedCount={selectedToDelete.length}
          isDeleting={isDeleting}
        />

        {/* Done/Cancel Button */}
        {deleteMode ? (
          <ButtonExit onPress={handleCancelDelete} />
        ) : (
          <Button variant="secondary" size="small" onPress={onClose}>
            <Text style={{ color: brandColors.textPrimary }}>Done</Text>
          </Button>
        )}
      </View>
    </View>
  )
}

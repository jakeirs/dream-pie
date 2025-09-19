// Following Import Order Standards (React 19+)
// 1. React Native Core & Expo
import { View, Text, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

// 2. UI components (@/components/ui)
import Button from '@/components/ui/Button/Button'
import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

// 3. Store imports
import { useSelfieChooserStore } from '@/stores'

// 4. Types imports
import { Selfie } from '@/types/dream/selfie'

// 5. Theme imports
import { brandColors } from '@/shared/theme'

interface SelfieHeaderProps {
  onClose: () => void
}

export const SelfieHeader = ({ onClose }: SelfieHeaderProps) => {
  const {
    deleteMode,
    setDeleteMode,
    selectedToDelete,
    clearSelectedToDelete,
    selfies,
    setSelfies
  } = useSelfieChooserStore()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePress = async () => {
    if (deleteMode) {
      // Delete selected selfies
      if (selectedToDelete.length > 0) {
        try {
          // Get selfies to delete
          const selfiesToDelete = selfies.filter(selfie => selectedToDelete.includes(selfie.id))

          // Delete files from filesystem and update AsyncStorage
          for (const selfie of selfiesToDelete) {
            try {
              // Only delete if it's a user-generated selfie (has a local file path)
              if (selfie.imageUrl.startsWith('file://')) {
                await File.deleteAsync(selfie.imageUrl)
              }
            } catch (error) {
              console.warn(`Failed to delete file ${selfie.imageUrl}:`, error)
            }
          }

          // Update AsyncStorage - remove deleted selfies from user_selfies
          try {
            const userSelfiesJson = await AsyncStorage.getItem('user_selfies')
            const userSelfies: Selfie[] = userSelfiesJson ? JSON.parse(userSelfiesJson) : []
            const updatedUserSelfies = userSelfies.filter(selfie => !selectedToDelete.includes(selfie.id))
            await AsyncStorage.setItem('user_selfies', JSON.stringify(updatedUserSelfies))
          } catch (error) {
            console.warn('Failed to update AsyncStorage:', error)
          }

          // Update store
          const remainingSelfies = selfies.filter(selfie => !selectedToDelete.includes(selfie.id))
          setSelfies(remainingSelfies)
          clearSelectedToDelete()
          setDeleteMode(false)
        } catch (error) {
          console.error('Error deleting selfies:', error)
        }
      }
    } else {
      // Enter delete mode
      setDeleteMode(true)
    }
  }

  const handleCancelDelete = () => {
    setDeleteMode(false)
    clearSelectedToDelete()
  }

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
          className="relative"
          style={{
            backgroundColor: brandColors.card,
            borderRadius: 20,
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Icon
            family={ICON_FAMILY_NAME.Feather}
            name="trash-2"
            size={20}
            color={brandColors.error}
          />
          {selectedToDelete.length > 0 && (
            <View
              style={{
                position: 'absolute',
                top: -5,
                right: -5,
                backgroundColor: brandColors.error,
                borderRadius: 10,
                width: 20,
                height: 20,
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              <Text style={{ color: brandColors.errorForeground, fontSize: 12, fontWeight: 'bold' }}>
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
              justifyContent: 'center'
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
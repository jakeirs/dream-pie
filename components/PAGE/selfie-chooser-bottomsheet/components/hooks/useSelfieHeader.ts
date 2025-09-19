import { useState } from 'react'
import * as FileSystem from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { useSelfieChooserStore } from '@/stores'
import { USER_SELFIES } from '@/stores/AsyncStorage/keys'
import { Selfie } from '@/types/dream/selfie'

export const useSelfieHeader = () => {
  const {
    deleteMode,
    setDeleteMode,
    selectedToDelete,
    clearSelectedToDelete,
    selfies,
    setSelfies,
  } = useSelfieChooserStore()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePress = async () => {
    if (deleteMode) {
      if (selectedToDelete.length === 0) {
        // Exit delete mode if no selfies are selected
        setDeleteMode(false)
        return
      }
      // Delete selected selfies
      if (selectedToDelete.length > 0) {
        setIsDeleting(true)
        try {
          // Get selfies to delete
          const selfiesToDelete = selfies.filter((selfie) => selectedToDelete.includes(selfie.id))

          // Delete files from filesystem
          for (const selfie of selfiesToDelete) {
            try {
              // Only delete if it's a user-generated selfie (has a local file path)
              if (
                selfie.imageUrl &&
                typeof selfie.imageUrl === 'string' &&
                selfie.imageUrl.startsWith('file://')
              ) {
                await FileSystem.deleteAsync(selfie.imageUrl)
              }
            } catch (error) {
              console.warn(`Failed to delete file ${selfie.imageUrl}:`, error)
            }
          }

          // Update AsyncStorage - remove deleted selfies from user_selfies
          try {
            const userSelfiesJson = await AsyncStorage.getItem(USER_SELFIES)
            const userSelfies: Selfie[] = userSelfiesJson ? JSON.parse(userSelfiesJson) : []
            const updatedUserSelfies = userSelfies.filter(
              (selfie) => !selectedToDelete.includes(selfie.id)
            )
            await AsyncStorage.setItem(USER_SELFIES, JSON.stringify(updatedUserSelfies))
          } catch (error) {
            console.warn('Failed to update AsyncStorage:', error)
          }

          // Update store
          const remainingSelfies = selfies.filter((selfie) => !selectedToDelete.includes(selfie.id))
          setSelfies(remainingSelfies)
          clearSelectedToDelete()
          setDeleteMode(false)
        } catch (error) {
          console.error('Error deleting selfies:', error)
        } finally {
          setIsDeleting(false)
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

  return {
    isDeleting,
    handleDeletePress,
    handleCancelDelete,
  }
}
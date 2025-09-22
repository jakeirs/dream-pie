import { useState } from 'react'

import { useSelfieChooserStore } from '@/stores'
import { deleteItemFromFileSystem } from '@/stores/fileSystem/utils/utils'
import { USER_SELFIES } from '@/stores/AsyncStorage/keys'

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
          // Delete each selected selfie using the utility function
          for (const selfieId of selectedToDelete) {
            try {
              await deleteItemFromFileSystem(selfieId, USER_SELFIES)
            } catch (error) {
              console.warn(`Failed to delete selfie ${selfieId}:`, error)
            }
          }

          // Update zustand store
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

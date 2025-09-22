import { useState } from 'react'

import { useSelfieChooserStore } from '@/stores'

export const useSelfieHeader = () => {
  const {
    deleteMode,
    setDeleteMode,
    selectedToDelete,
    clearSelectedToDelete,
    deleteSelfiesAndWait,
  } = useSelfieChooserStore()

  const [isDeleting, setIsDeleting] = useState(false)

  const handleDeletePress = async () => {
    if (deleteMode) {
      if (selectedToDelete.length === 0) {
        // Exit delete mode if no selfies are selected
        setDeleteMode(false)
        return
      }
      // Delete selected selfies efficiently
      if (selectedToDelete.length > 0) {
        setIsDeleting(true)
        try {
          // Use efficient delete method that preserves existing references
          await deleteSelfiesAndWait(selectedToDelete)

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

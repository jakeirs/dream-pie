/**
 * DELETE ITEM FROM FILESYSTEM UTILITY
 *
 * FileSystem + AsyncStorage utility for removing items from both storage layers.
 * Handles bulk deletion operations with proper error handling and cleanup.
 *
 * WHERE USED:
 * - useUtilsFileSystemStats.ts: Bulk deletion of stored items
 * - Individual stores: Removing unwanted items
 * - Components: User-initiated delete operations
 *
 * WHY COMBINED:
 * - Deletion requires both FileSystem cleanup AND AsyncStorage updates
 * - Maintains data consistency between storage layers
 * - Bulk operations for efficiency
 * - Proper error handling for partial failures
 *
 * PROCESS:
 * 1. Load existing items from AsyncStorage
 * 2. Find items to delete by IDs
 * 3. Delete associated files from FileSystem
 * 4. Remove items from AsyncStorage array
 * 5. Update AsyncStorage with cleaned array
 */

import { File } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * Delete items from both FileSystem and AsyncStorage
 * Universal function that works for any item type (poses, selfies, creations, etc.)
 * Always expects an array of item IDs for consistent bulk operations
 *
 * @param itemIds - Array of item IDs to delete
 * @param asyncStorageKey - AsyncStorage key for the data collection
 */
export const deleteItemFromFileSystem = async <T extends ImageItem>(
  itemIds: string[],
  asyncStorageKey: string
): Promise<void> => {
  try {
    console.log(
      `🗑️ Deleting ${itemIds.length} items from FileSystem + AsyncStorage (${asyncStorageKey})`
    )

    // Load existing items
    const items = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    const itemsToDelete = items.filter((item) => itemIds.includes(item.id))

    // Delete files
    for (const item of itemsToDelete) {
      if (item.imageUrl && item.imageUrl.startsWith('file://')) {
        try {
          const file = new File(item.imageUrl)
          await file.delete()
        } catch (fileError) {
          console.warn(`⚠️ Failed to delete file for item ${item.id}:`, fileError)
        }
      }
    }

    // Remove from AsyncStorage
    const updatedItems = items.filter((item) => !itemIds.includes(item.id))
    await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(updatedItems))
  } catch (error) {
    console.error(`❌ Error deleting items:`, error)
    throw error
  }
}

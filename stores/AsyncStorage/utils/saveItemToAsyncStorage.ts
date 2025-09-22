/**
 * ASYNCSTORAGE SAVE UTILITY
 *
 * Pure AsyncStorage utility for saving items with ID-based operations.
 * Handles both adding new items and updating existing items by ID.
 *
 * WHERE USED:
 * - addToFileSystemAsyncStorage.ts: After copying files to FileSystem
 * - syncWithFileSystemAsyncStorage.ts: Syncing data between stores
 * - Individual stores: Direct AsyncStorage save operations
 *
 * WHY SEPARATE:
 * - Pure AsyncStorage operation (no FileSystem dependency)
 * - Reusable across different data types (poses, selfies, etc.)
 * - Focused responsibility: only handles AsyncStorage save logic
 *
 * PROCESS:
 * 1. Load existing items from AsyncStorage
 * 2. Check if item exists by ID
 * 3. Update existing item or add new item
 * 4. Save updated array back to AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

// Define common interface for items with ID
interface ItemWithId {
  id: string
}

/**
 * Save item to AsyncStorage
 * Updates existing item by ID or adds new item if not found
 *
 * @param item - Item to save (must have id property)
 * @param asyncStorageKey - AsyncStorage key for the data collection
 */
export const saveItemToAsyncStorage = async <T extends ItemWithId>(
  item: T,
  asyncStorageKey: string
): Promise<void> => {
  try {
    const existingItems = await AsyncStorage.getItem(asyncStorageKey)
    const items = existingItems ? JSON.parse(existingItems) : []

    // Check if item already exists and update it, otherwise add new
    const existingIndex = items.findIndex((i: T) => i.id === item.id)
    if (existingIndex >= 0) {
      items[existingIndex] = item
    } else {
      items.push(item)
    }

    await AsyncStorage.setItem(asyncStorageKey, JSON.stringify(items))
  } catch (error) {
    console.error(`❌ Error saving item ${item.id} to AsyncStorage:`, error)
    throw error
  }
}

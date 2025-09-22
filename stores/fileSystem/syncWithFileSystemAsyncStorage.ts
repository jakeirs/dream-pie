/**
 * SYNC WITH FILESYSTEM & ASYNCSTORAGE - Enhanced synchronization logic
 *
 * This module provides the new synchronization logic that compares AsyncStorage
 * against incoming data from setPoses/setSelfies, adding new items and removing
 * obsolete ones while maintaining file system consistency.
 *
 * PROCESS FLOW:
 * 1. Load current AsyncStorage items
 * 2. Compare with incoming items from setPoses/setSelfies
 * 3. Add new items using addToFileSystemAsyncStorage (latest FileSystem API)
 * 4. Remove obsolete items using deleteItemFromFileSystem
 * 5. Return synchronized items with file URIs
 *
 * IMPROVEMENTS OVER OLD SYSTEM:
 * - Uses latest FileSystem API (File, Paths.document)
 * - Consistent itemId + asyncStorageKey pattern
 * - Better error handling and logging
 * - Works with both poses and selfies using generics
 *
 * CALLED BY:
 * - poseStore.setPoses() - Compare AsyncStorage vs incoming mockData poses
 * - selfieChooserStore.setSelfies() - Compare AsyncStorage vs incoming mockData selfies
 */

import { addToFileSystemAsyncStorage } from './utils/addToFileSystemAsyncStorage'
import { deleteItemFromFileSystem, loadItemsFromAsyncStorage } from './utils/utils'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * NEW SYNC FUNCTION: Compare AsyncStorage vs incoming data and synchronize
 * This replaces syncMockDataWithFileSystem with enhanced logic
 *
 * @param incomingItems - Items from setPoses/setSelfies (mockData or other sources)
 * @param asyncStorageKey - AsyncStorage key (USER_POSES, USER_SELFIES, etc.)
 * @param itemType - Type descriptor for logging ('pose', 'selfie', etc.)
 * @returns Synchronized items with file URIs
 */
export const syncWithFileSystemAsyncStorage = async <T extends ImageItem>(
  incomingItems: T[],
  asyncStorageKey: string,
  itemType: string
): Promise<T[]> => {
  try {
    console.log(`🔄 Starting ${itemType} sync - comparing AsyncStorage vs incoming data`)
    console.log(`📥 Incoming ${itemType}s: ${incomingItems.length}`)

    // 1. Load current AsyncStorage items
    const storedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    console.log(`💾 AsyncStorage ${itemType}s: ${storedItems.length}`)

    // 2. Create ID sets for comparison
    const incomingIds = new Set(incomingItems.map((item) => item.id))
    const storedIds = new Set(storedItems.map((item) => item.id))

    // 3. Find items to ADD (in incoming, not in AsyncStorage)
    const itemsToAdd = incomingItems.filter((item) => !storedIds.has(item.id))
    console.log(`➕ New ${itemType}s to add: ${itemsToAdd.length}`)

    // 4. Find items to REMOVE (in AsyncStorage, not in incoming)
    const itemsToRemove = storedItems.filter((item) => !incomingIds.has(item.id))
    console.log(`➖ Obsolete ${itemType}s to remove: ${itemsToRemove.length}`)

    // 5. Process additions: add to FileSystem + AsyncStorage
    for (const incomingItem of itemsToAdd) {
      console.log(`➕ Adding new ${itemType}: ${incomingItem.name}`)

      try {
        // Use new utility to add to FileSystem + AsyncStorage
        await addToFileSystemAsyncStorage(incomingItem, asyncStorageKey, itemType)
        console.log(`✅ Successfully added ${itemType}: ${incomingItem.name}`)
      } catch (error) {
        console.error(`❌ Failed to add NEW ${itemType} ${incomingItem.name}:`, error)
        // Continue with next item instead of failing entire sync
        continue
      }
    }

    // 6. Process removals: delete from FileSystem + AsyncStorage
    for (const itemToRemove of itemsToRemove) {
      console.log(`➖ Removing obsolete ${itemType}: ${itemToRemove.name}`)

      try {
        // Use existing utility to delete from FileSystem + AsyncStorage
        await deleteItemFromFileSystem(itemToRemove.id, asyncStorageKey)
        console.log(`✅ Successfully removed ${itemType}: ${itemToRemove.name}`)
      } catch (error) {
        console.error(`❌ Failed to remove ${itemType} ${itemToRemove.name}:`, error)
        // Continue with next item instead of failing entire sync
        continue
      }
    }

    // 7. Return final synchronized items (all with file URIs)
    const syncedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    console.log(`✅ Sync complete! ${syncedItems.length} ${itemType}s with file URIs`)

    return syncedItems
  } catch (error) {
    console.error(`❌ Error during ${itemType} sync with FileSystem + AsyncStorage:`, error)

    // Enhanced fallback: try to return existing items if available
    try {
      const existingItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
      console.log(`🔄 Fallback: returning ${existingItems.length} existing ${itemType}s`)
      return existingItems
    } catch (fallbackError) {
      console.error('❌ Fallback also failed:', fallbackError)
      return []
    }
  }
}

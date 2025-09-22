/**
 * SYNC WITH FILESYSTEM & ASYNCSTORAGE UTILITY
 *
 * FileSystem + AsyncStorage utility for synchronizing data between storage layers.
 * Compares AsyncStorage against incoming data, adding new items and removing obsolete ones.
 *
 * WHERE USED:
 * - poseStore.setPoses(): Compare AsyncStorage vs incoming mockData poses
 * - selfieChooserStore.setSelfies(): Compare AsyncStorage vs incoming mockData selfies
 * - Any store requiring data synchronization between sources and storage
 *
 * WHY COMBINED:
 * - Sync operations require both FileSystem and AsyncStorage coordination
 * - Complex comparison logic between stored and incoming data
 * - Bulk operations for efficiency (add multiple, remove multiple)
 * - Maintains data consistency across storage layers
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
 */

import { addToFileSystemAsyncStorage } from './addToFileSystemAsyncStorage'
import { deleteItemFromFileSystem } from './deleteItemFromFileSystem'
import { loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * Compare AsyncStorage vs incoming data and synchronize
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
    console.log(`🔄 Starting ${itemType} sync between storage layers`)

    // 1. Load current AsyncStorage items
    const storedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)

    // 2. Create ID sets for comparison
    const incomingIds = new Set(incomingItems.map((item) => item.id))
    const storedIds = new Set(storedItems.map((item) => item.id))

    // 3. Find items to ADD (in incoming, not in AsyncStorage)
    const itemsToAdd = incomingItems.filter((item) => !storedIds.has(item.id))

    // 4. Find items to REMOVE (in AsyncStorage, not in incoming)
    const itemsToRemove = storedItems.filter((item) => !incomingIds.has(item.id))

    console.log(`📊 Sync analysis: ${itemsToAdd.length} to add, ${itemsToRemove.length} to remove`)

    // 5. Process additions: add to FileSystem + AsyncStorage
    for (const incomingItem of itemsToAdd) {
      try {
        // Use new utility to add to FileSystem + AsyncStorage
        await addToFileSystemAsyncStorage(incomingItem, asyncStorageKey, itemType)
      } catch (error) {
        console.warn(`⚠️ Failed to add ${itemType} ${incomingItem.id}, continuing sync:`, error)
        // Continue with next item instead of failing entire sync
        continue
      }
    }

    // 6. Process removals: delete from FileSystem + AsyncStorage
    if (itemsToRemove.length > 0) {
      const idsToRemove = itemsToRemove.map((item) => item.id)
      await deleteItemFromFileSystem(idsToRemove, asyncStorageKey)
    }

    // 7. Return final synchronized items (all with file URIs)
    const syncedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    console.log(`✅ Sync completed: ${syncedItems.length} ${itemType}s synchronized`)
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
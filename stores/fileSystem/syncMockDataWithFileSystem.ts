/**
 * UNIVERSAL SYNC MOCK DATA WITH FILE SYSTEM - Main synchronization logic
 *
 * This module handles the core synchronization between mockData items (poses/selfies)
 * and the device file system, ensuring AsyncStorage always mirrors mockData
 * with proper file URIs.
 *
 * PROCESS FLOW:
 * 1. Load current AsyncStorage items
 * 2. Compare with mockData items
 * 3. Add missing items (copy assets to file system)
 * 4. Remove obsolete items (delete files and storage)
 * 5. Return synced items with file URIs
 *
 * CALLED BY:
 * - poseStore.setPoses() - Automatic sync when mockData is loaded
 * - selfieStore.setSelfies() - Automatic sync when mockData is loaded
 */

import { Pose } from '@/types/dream/pose'
import { Selfie } from '@/types/dream/selfie'
import { USER_POSES, USER_SELFIES } from '../AsyncStorage/keys'
import {
  copyBundledAssetToFileSystem,
  saveItemToAsyncStorage,
  loadItemsFromAsyncStorage,
  deleteItemFromFileSystem,
} from './utils/utils'

// Define common interface for items with imageUrl
interface ImageItem {
  id: string
  name: string
  imageUrl: string
}

/**
 * UNIVERSAL SYNC FUNCTION: Sync mockData items with file system
 * This is called automatically when setPoses() or setSelfies() is invoked
 */
export const syncMockDataWithFileSystem = async <T extends ImageItem>(
  mockItems: T[],
  asyncStorageKey: string,
  itemType: string
): Promise<T[]> => {
  try {
    console.log(`🔄 Starting ${itemType} sync with ${mockItems.length} mockData items`)

    // 1. Load current AsyncStorage items
    const storedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    console.log(`📦 Found ${storedItems.length} ${itemType}s in AsyncStorage`)

    // 2. Create ID sets for comparison
    const mockIds = new Set(mockItems.map((item) => item.id))
    const storedIds = new Set(storedItems.map((item) => item.id))

    // 3. Find items to ADD (in mock, not in storage)
    const itemsToAdd = mockItems.filter((item) => !storedIds.has(item.id))
    console.log(`➕ ${itemType}s to add: ${itemsToAdd.length}`)

    // 4. Find items to REMOVE (in storage, not in mock)
    const itemsToRemove = storedItems.filter((item) => !mockIds.has(item.id))
    console.log(`➖ ${itemType}s to remove: ${itemsToRemove.length}`)

    // 5. Process additions: copy bundled assets to file system
    for (const mockItem of itemsToAdd) {
      console.log(`➕ Adding ${itemType}: ${mockItem.name}`)

      try {
        // Copy bundled asset to file system
        const fileUri = await copyBundledAssetToFileSystem(mockItem, itemType)

        // Create item with file URI
        const fileSystemItem: T = {
          ...mockItem,
          imageUrl: fileUri, // Replace bundled asset with file URI
        }

        // Save to AsyncStorage
        await saveItemToAsyncStorage(fileSystemItem, asyncStorageKey)
        console.log(`✅ Successfully added ${itemType}: ${mockItem.name}`)
      } catch (error) {
        console.error(`❌ Failed to add ${itemType} ${mockItem.name}:`, error)
        // Continue with next item instead of failing entire sync
        continue
      }
    }

    // 6. Process removals: delete files and remove from storage
    if (itemsToRemove.length > 0) {
      const idsToRemove = itemsToRemove.map(item => item.id)
      await deleteItemFromFileSystem(idsToRemove, asyncStorageKey)
    }

    // 7. Return synced items (all with file URIs)
    const syncedItems = await loadItemsFromAsyncStorage<T>(asyncStorageKey)
    console.log(`✅ Sync complete! ${syncedItems.length} ${itemType}s with file URIs`)

    return syncedItems
  } catch (error) {
    console.error(`❌ Error during ${itemType} sync:`, error)

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



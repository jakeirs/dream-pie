/**
 * ASYNCSTORAGE LOAD UTILITY
 *
 * Pure AsyncStorage utility for loading items from storage.
 * Handles JSON parsing and provides type-safe returns with error handling.
 *
 * WHERE USED:
 * - deleteItemFromFileSystem.ts: Loading items before deletion
 * - syncWithFileSystemAsyncStorage.ts: Loading existing data for sync
 * - Individual stores: Direct AsyncStorage load operations
 * - Components: Loading stored user data (poses, selfies, etc.)
 *
 * WHY SEPARATE:
 * - Pure AsyncStorage operation (no FileSystem dependency)
 * - Reusable across different data types with TypeScript generics
 * - Focused responsibility: only handles AsyncStorage load logic
 * - Consistent error handling and empty array fallback
 *
 * PROCESS:
 * 1. Retrieve data from AsyncStorage using provided key
 * 2. Parse JSON data safely
 * 3. Return typed array or empty array on error/missing data
 */

import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Load items from AsyncStorage
 * Returns empty array if key doesn't exist or on parsing error
 *
 * @param asyncStorageKey - AsyncStorage key for the data collection
 * @returns Array of items or empty array
 */
export const loadItemsFromAsyncStorage = async <T>(asyncStorageKey: string): Promise<T[]> => {
  try {
    const storedItems = await AsyncStorage.getItem(asyncStorageKey)
    const items = storedItems ? JSON.parse(storedItems) : []

    return items
  } catch (error) {
    console.error(`❌ Error loading items from AsyncStorage (${asyncStorageKey}):`, error)
    return []
  }
}

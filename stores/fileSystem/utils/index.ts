/**
 * FILESYSTEM UTILS INDEX - Centralized exports for FileSystem utilities
 *
 * This index file provides centralized access to all FileSystem utilities
 * used throughout the Dream Pie app for managing assets and user content.
 *
 * AVAILABLE UTILITIES:
 * - addToFileSystemAsyncStorage: Add new items to FileSystem + AsyncStorage
 * - deleteItemFromFileSystem: Remove items from FileSystem + AsyncStorage
 * - copyBundledAssetToFileSystem: Copy bundled assets to FileSystem
 * - saveItemToAsyncStorage: Save items to AsyncStorage
 * - loadItemsFromAsyncStorage: Load items from AsyncStorage
 */

// New enhanced utility for adding items (latest FileSystem API)
export { addToFileSystemAsyncStorage } from './addToFileSystemAsyncStorage'

// Core utilities (hybrid API approach)
export {
  copyBundledAssetToFileSystem,
  saveItemToAsyncStorage,
  loadItemsFromAsyncStorage,
  deleteItemFromFileSystem,
} from './utils'
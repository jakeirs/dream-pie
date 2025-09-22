/**
 * FILESYSTEM UTILS INDEX - Centralized exports for FileSystem utilities
 *
 * This index file provides centralized access to all FileSystem utilities
 * used throughout the Dream Pie app for managing assets and user content.
 *
 * AVAILABLE UTILITIES:
 * - addToFileSystemAsyncStorage: Add new items to FileSystem + AsyncStorage (multi-source)
 * - deleteItemFromFileSystem: Remove items from FileSystem + AsyncStorage (bulk ops)
 * - copyBundledAssetToFileSystem: Copy bundled assets to FileSystem (pure FileSystem)
 * - syncWithFileSystemAsyncStorage: Synchronize data between storage layers
 *
 * USAGE PATTERNS:
 * - Pure FileSystem: copyBundledAssetToFileSystem
 * - FileSystem + AsyncStorage: addToFileSystemAsyncStorage, deleteItemFromFileSystem
 * - Complex sync operations: syncWithFileSystemAsyncStorage
 * - Pure AsyncStorage: Use @/stores/AsyncStorage/utils instead
 */

// Multi-source FileSystem + AsyncStorage operations
export { addToFileSystemAsyncStorage } from './utils/addToFileSystemAsyncStorage'
export { deleteItemFromFileSystem } from './utils/deleteItemFromFileSystem'
export { syncWithFileSystemAsyncStorage } from './utils/syncWithFileSystemAsyncStorage'

// Pure FileSystem operations
export { copyBundledAssetToFileSystem } from './utils/[depricated]__copyBundledAssetToFileSystem'

/**
 * ASYNCSTORAGE UTILS INDEX - Centralized exports for AsyncStorage utilities
 *
 * This index file provides centralized access to all pure AsyncStorage utilities
 * used throughout the Dream Pie app for persistent data operations.
 *
 * AVAILABLE UTILITIES:
 * - saveItemToAsyncStorage: Save/update items with ID-based operations
 * - loadItemsFromAsyncStorage: Load items with type safety and error handling
 *
 * USAGE PATTERN:
 * import { saveItemToAsyncStorage, loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'
 *
 * WHY SEPARATE FROM FILESYSTEM:
 * - Pure AsyncStorage operations (no FileSystem dependency)
 * - Reusable across different data types and stores
 * - Clear separation of concerns from FileSystem+AsyncStorage operations
 */

// Pure AsyncStorage utilities
export { saveItemToAsyncStorage } from './saveItemToAsyncStorage'
export { loadItemsFromAsyncStorage } from './loadItemsFromAsyncStorage'
import { Directory, Paths } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

/**
 * Utility functions for file system and AsyncStorage operations
 * Used by useFileSystemStats for stats calculation
 */
export const useUtilsFileSystemStats = () => {
  /**
   * Count files by pattern in document directory
   */
  const countFilesByPattern = async (pattern: RegExp): Promise<number> => {
    try {
      const documentDir = new Directory(Paths.document)
      const exists = await documentDir.exists

      if (!exists) {
        return 0
      }

      const files = await documentDir.list()
      const fileNames = files.map(file => file.name)
      return fileNames.filter((fileName) => pattern.test(fileName)).length
    } catch (error) {
      console.warn('Error counting files by pattern:', error)
      return 0
    }
  }

  /**
   * Get total file count in document directory
   */
  const getTotalFileSystemFiles = async (): Promise<number> => {
    try {
      const documentDir = new Directory(Paths.document)
      const exists = await documentDir.exists

      if (!exists) {
        return 0
      }

      const files = await documentDir.list()
      return files.length
    } catch (error) {
      console.warn('Error counting total files:', error)
      return 0
    }
  }

  /**
   * Count items in AsyncStorage by key
   */
  const countAsyncStorageItems = async (key: string): Promise<number> => {
    try {
      const data = await AsyncStorage.getItem(key)
      if (!data) return 0

      const items = JSON.parse(data)
      return Array.isArray(items) ? items.length : 0
    } catch (error) {
      console.warn(`Error counting AsyncStorage items for key ${key}:`, error)
      return 0
    }
  }

  return {
    countFilesByPattern,
    getTotalFileSystemFiles,
    countAsyncStorageItems,
  }
}
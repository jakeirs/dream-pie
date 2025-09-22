import { Directory, Paths, File } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_SELFIES } from '@/stores/AsyncStorage/keys'
import { deleteItemFromFileSystem } from '@/stores/fileSystem/utils/utils'

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

  /**
   * Remove all selfie files from FileSystem and AsyncStorage
   * Uses the bulk delete utility for consistency with other deletion operations
   */
  const removeAllSelfies = async (): Promise<{ success: boolean; deleted: number; error?: string }> => {
    try {
      console.log('🔄 removeAllSelfies called - starting bulk selfie removal')

      // Load all selfie data from AsyncStorage to get their IDs
      const selfieData = await AsyncStorage.getItem(USER_SELFIES)

      if (!selfieData) {
        console.log('📝 No selfies found in AsyncStorage')

        // Still check FileSystem for orphaned files
        let deletedCount = 0
        const documentDir = new Directory(Paths.document)
        const exists = await documentDir.exists

        if (exists) {
          const files = await documentDir.list()
          const selfieFiles = files.filter(file => file.name.match(/^selfie_.*\.jpg$/))

          for (const file of selfieFiles) {
            try {
              const fileObj = new File(file.uri)
              await fileObj.delete()
              deletedCount++
              console.log(`🗑️ Deleted orphaned selfie file: ${file.name}`)
            } catch (fileError) {
              console.warn(`Failed to delete orphaned file ${file.name}:`, fileError)
            }
          }
        }

        return { success: true, deleted: deletedCount }
      }

      // Parse selfie data and extract IDs
      const selfies = JSON.parse(selfieData)
      if (!Array.isArray(selfies) || selfies.length === 0) {
        console.log('📝 No valid selfies found in AsyncStorage')
        return { success: true, deleted: 0 }
      }

      const selfieIds = selfies.map(selfie => selfie.id)
      console.log(`📊 Found ${selfieIds.length} selfies to delete`)

      // Use the bulk delete function for consistency
      await deleteItemFromFileSystem(selfieIds, USER_SELFIES)

      console.log(`✅ removeAllSelfies complete - removed ${selfieIds.length} selfies`)
      return { success: true, deleted: selfieIds.length }

    } catch (error) {
      console.error('❌ Error removing all selfies:', error)
      return {
        success: false,
        deleted: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  return {
    countFilesByPattern,
    getTotalFileSystemFiles,
    countAsyncStorageItems,
    removeAllSelfies,
  }
}
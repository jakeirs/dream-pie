import { Directory, Paths, File } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { USER_SELFIES, USER_POSES, USER_CREATIONS } from '@/stores/AsyncStorage/keys'
import { deleteItemFromFileSystem } from '@/stores/fileSystem'

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
      const fileNames = files.map((file) => file.name)
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
   * Remove all data (selfies, poses, and creations) from FileSystem and AsyncStorage
   * Comprehensive cleanup function that removes all user-generated content
   */
  const removeAllData = async (): Promise<{
    success: boolean
    deleted: { selfies: number; poses: number; creations: number; total: number }
    error?: string
  }> => {
    try {
      console.log('🔄 removeAllData called - starting comprehensive data removal')

      let totalDeleted = 0
      const deletedCounts = { selfies: 0, poses: 0, creations: 0, total: 0 }

      // Define data types to process
      const dataTypes = [
        { key: USER_SELFIES, filePattern: /^selfie_.*\.jpg$/, name: 'selfies' },
        { key: USER_POSES, filePattern: /^pose_.*\.jpg$/, name: 'poses' },
        { key: USER_CREATIONS, filePattern: /^creation_.*\.jpg$/, name: 'creations' },
      ]

      // Process each data type
      for (const dataType of dataTypes) {
        try {
          console.log(`🔄 Processing ${dataType.name}...`)

          // Load data from AsyncStorage to get IDs
          const asyncData = await AsyncStorage.getItem(dataType.key)
          let itemIds: string[] = []

          if (asyncData) {
            const items = JSON.parse(asyncData)
            if (Array.isArray(items) && items.length > 0) {
              itemIds = items.map((item) => item.id)
              console.log(`📊 Found ${itemIds.length} ${dataType.name} in AsyncStorage`)
            }
          }

          if (itemIds.length > 0) {
            // Use bulk delete function for consistency
            await deleteItemFromFileSystem(itemIds, dataType.key)
            deletedCounts[dataType.name as keyof typeof deletedCounts] = itemIds.length
            totalDeleted += itemIds.length
            console.log(`✅ Deleted ${itemIds.length} ${dataType.name} via bulk delete`)
          } else {
            // Check for orphaned files in FileSystem
            const documentDir = new Directory(Paths.document)
            const exists = await documentDir.exists

            if (exists) {
              const files = await documentDir.list()
              const matchingFiles = files.filter((file) => dataType.filePattern.test(file.name))

              let orphanedDeleted = 0
              for (const file of matchingFiles) {
                try {
                  const fileObj = new File(file.uri)
                  await fileObj.delete()
                  orphanedDeleted++
                  console.log(`🗑️ Deleted orphaned ${dataType.name} file: ${file.name}`)
                } catch (fileError) {
                  console.warn(`Failed to delete orphaned file ${file.name}:`, fileError)
                }
              }

              if (orphanedDeleted > 0) {
                deletedCounts[dataType.name as keyof typeof deletedCounts] = orphanedDeleted
                totalDeleted += orphanedDeleted
                console.log(`✅ Deleted ${orphanedDeleted} orphaned ${dataType.name} files`)
              }
            }
          }
        } catch (typeError) {
          console.warn(`⚠️ Error processing ${dataType.name}:`, typeError)
          // Continue with other types even if one fails
        }
      }

      deletedCounts.total = totalDeleted
      console.log(`✅ removeAllData complete - removed ${totalDeleted} total items:`, deletedCounts)

      return { success: true, deleted: deletedCounts }
    } catch (error) {
      console.error('❌ Error removing all data:', error)
      return {
        success: false,
        deleted: { selfies: 0, poses: 0, creations: 0, total: 0 },
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  return {
    countFilesByPattern,
    getTotalFileSystemFiles,
    countAsyncStorageItems,
    removeAllData,
  }
}

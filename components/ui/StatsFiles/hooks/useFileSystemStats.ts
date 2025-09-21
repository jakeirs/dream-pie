import { useState, useEffect } from 'react'
import { Directory, Paths } from 'expo-file-system'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { USER_POSES, USER_SELFIES, USER_CREATIONS } from '@/stores/AsyncStorage/keys'
import { FilterType } from '@/types/dream/gallery'

export interface FileSystemStats {
  total: number
  poses: number
  selfies: number
  creations: number
  others: number
}

export interface AsyncStorageStats {
  poses: number
  selfies: number
  creations: number
}

export interface StatsData {
  fileSystem: FileSystemStats
  asyncStorage: AsyncStorageStats
  isLoading: boolean
  error: string | null
}

export interface UseFileSystemStatsReturn {
  stats: StatsData
  refreshStats: () => Promise<void>
}

/**
 * Hook to get comprehensive file system and AsyncStorage statistics
 * Integrates with gallery filters to show detailed stats for active filter
 */
export const useFileSystemStats = (): UseFileSystemStatsReturn => {
  const [stats, setStats] = useState<StatsData>({
    fileSystem: {
      total: 0,
      poses: 0,
      selfies: 0,
      creations: 0,
      others: 0,
    },
    asyncStorage: {
      poses: 0,
      selfies: 0,
      creations: 0,
    },
    isLoading: true,
    error: null,
  })

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
   * Refresh all statistics
   */
  const refreshStats = async (): Promise<void> => {
    try {
      setStats(prev => ({ ...prev, isLoading: true, error: null }))

      // Count FileSystem files by patterns
      const [
        totalFiles,
        poseFiles,
        selfieFiles,
        creationFiles,
      ] = await Promise.all([
        getTotalFileSystemFiles(),
        countFilesByPattern(/^pose_.*\.jpg$/),
        countFilesByPattern(/^selfie_.*\.jpg$/),
        countFilesByPattern(/^creation_.*\.jpg$/),
      ])

      const otherFiles = totalFiles - (poseFiles + selfieFiles + creationFiles)

      // Count AsyncStorage items
      const [
        asyncPoses,
        asyncSelfies,
        asyncCreations,
      ] = await Promise.all([
        countAsyncStorageItems(USER_POSES),
        countAsyncStorageItems(USER_SELFIES),
        countAsyncStorageItems(USER_CREATIONS),
      ])

      setStats({
        fileSystem: {
          total: totalFiles,
          poses: poseFiles,
          selfies: selfieFiles,
          creations: creationFiles,
          others: otherFiles,
        },
        asyncStorage: {
          poses: asyncPoses,
          selfies: asyncSelfies,
          creations: asyncCreations,
        },
        isLoading: false,
        error: null,
      })
    } catch (error) {
      console.error('Error refreshing stats:', error)
      setStats(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }))
    }
  }

  // Initial load
  useEffect(() => {
    refreshStats()
  }, []) // refreshStats is stable due to useCallback usage patterns

  return {
    stats,
    refreshStats,
  }
}

/**
 * Get stats for a specific filter type
 */
export const getStatsForFilter = (
  stats: StatsData,
  filterType: FilterType
): {
  fileSystem: number
  asyncStorage: number
} => {
  switch (filterType) {
    case 'poses':
      return {
        fileSystem: stats.fileSystem.poses,
        asyncStorage: stats.asyncStorage.poses,
      }
    case 'selfies':
      return {
        fileSystem: stats.fileSystem.selfies,
        asyncStorage: stats.asyncStorage.selfies,
      }
    case 'creations':
      return {
        fileSystem: stats.fileSystem.creations,
        asyncStorage: stats.asyncStorage.creations,
      }
    default:
      return {
        fileSystem: 0,
        asyncStorage: 0,
      }
  }
}
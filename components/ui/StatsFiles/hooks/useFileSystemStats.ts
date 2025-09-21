import { useState, useEffect } from 'react'

import { useUtilsFileSystemStats } from '@/hooks/useUtilsFileSystemStats'
import { USER_POSES, USER_SELFIES, USER_CREATIONS } from '@/stores/AsyncStorage/keys'

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
  const { countFilesByPattern, getTotalFileSystemFiles, countAsyncStorageItems } =
    useUtilsFileSystemStats()

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
   * Refresh all statistics
   */
  const refreshStats = async (): Promise<void> => {
    try {
      setStats((prev) => ({ ...prev, isLoading: true, error: null }))

      // Count FileSystem files by patterns
      const [totalFiles, poseFiles, selfieFiles, creationFiles] = await Promise.all([
        getTotalFileSystemFiles(),
        countFilesByPattern(/^pose_.*\.jpg$/),
        countFilesByPattern(/^selfie_.*\.jpg$/),
        countFilesByPattern(/^creation_.*\.jpg$/),
      ])

      const otherFiles = totalFiles - (poseFiles + selfieFiles + creationFiles)

      // Count AsyncStorage items
      const [asyncPoses, asyncSelfies, asyncCreations] = await Promise.all([
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
      setStats((prev) => ({
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

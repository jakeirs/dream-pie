import { View, Text, Pressable, ScrollView } from 'react-native'
import { useState, useEffect, useCallback } from 'react'

import Card from '@/components/ui/Card/Card'
import { Icon } from '@/components/ui/icons/Icon'
import { useAppStores } from '@/stores'
import { useFileSystemStats } from '@/components/ui/StatsFiles/hooks/useFileSystemStats'
import { Directory, Paths } from 'expo-file-system'

import { FilterType } from '@/types/dream/gallery'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

interface StatsFilesProps {
  activeFilter: FilterType
  className?: string
}

interface StatRowProps {
  icon: string
  label: string
  fileSystem: number
  asyncStorage: number
  zustand: number
  isActive?: boolean
}

const StatRow = ({ icon, label, fileSystem, asyncStorage, zustand, isActive }: StatRowProps) => (
  <View
    className={`flex-row items-center justify-between rounded-lg px-3 py-2 ${
      isActive ? 'bg-blue-50' : 'bg-gray-50'
    }`}>
    <View className="flex-1 flex-row items-center">
      <Text className="mr-2 text-xl">{icon}</Text>
      <Text className={`font-medium ${isActive ? 'text-blue-800' : 'text-gray-700'}`}>{label}</Text>
    </View>

    <View className="flex-row items-center gap-4">
      <View className="items-center">
        <Text className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
          {fileSystem}
        </Text>
        <Text className="text-xs text-gray-400">FS</Text>
      </View>

      <View className="items-center">
        <Text className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
          {asyncStorage}
        </Text>
        <Text className="text-xs text-gray-400">AS</Text>
      </View>

      <View className="items-center">
        <Text className={`text-sm font-bold ${isActive ? 'text-blue-600' : 'text-gray-600'}`}>
          {zustand}
        </Text>
        <Text className="text-xs text-gray-400">ZS</Text>
      </View>
    </View>
  </View>
)

interface FileSystemFile {
  name: string
  uri: string
  type: 'pose' | 'selfie' | 'creation' | 'other'
}

export default function StatsFiles({ activeFilter, className = '' }: StatsFilesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showUrlList, setShowUrlList] = useState(false)
  const [fileSystemFiles, setFileSystemFiles] = useState<FileSystemFile[]>([])
  const [isLoadingObjects, setIsLoadingObjects] = useState(false)

  const { stats, refreshStats } = useFileSystemStats()
  const { pose, selfieChooser, creation } = useAppStores()

  // Load ALL actual FileSystem files
  const loadFileSystemObjects = useCallback(async () => {
    setIsLoadingObjects(true)
    try {
      const documentDir = new Directory(Paths.document)
      const exists = await documentDir.exists

      if (!exists) {
        setFileSystemFiles([])
        return
      }

      const files = await documentDir.list()
      const fileList: FileSystemFile[] = files.map((file) => {
        const fileName = file.name
        let type: 'pose' | 'selfie' | 'creation' | 'other' = 'other'

        // Determine type based on filename pattern
        if (fileName.match(/^pose_.*\.jpg$/)) {
          type = 'pose'
        } else if (fileName.match(/^selfie_.*\.jpg$/)) {
          type = 'selfie'
        } else if (fileName.match(/^creation_.*\.jpg$/)) {
          type = 'creation'
        }

        return {
          name: fileName,
          uri: file.uri,
          type,
        }
      })

      // Sort by type then by name
      fileList.sort((a, b) => {
        if (a.type !== b.type) {
          const typeOrder = { pose: 1, selfie: 2, creation: 3, other: 4 }
          return typeOrder[a.type] - typeOrder[b.type]
        }
        return a.name.localeCompare(b.name)
      })

      setFileSystemFiles(fileList)
    } catch (error) {
      console.error('Error loading FileSystem files:', error)
      setFileSystemFiles([])
    } finally {
      setIsLoadingObjects(false)
    }
  }, [])

  // Load objects when URL list is shown
  useEffect(() => {
    if (showUrlList) {
      loadFileSystemObjects()
    }
  }, [showUrlList, loadFileSystemObjects])

  // Get Zustand counts (real-time)
  const zustandCounts = {
    poses: pose.poses.length,
    selfies: selfieChooser.selfies.length,
    creations: creation.creations.length,
  }

  // Prepare all stats for expanded view
  const allStats = [
    {
      type: 'poses' as FilterType,
      icon: '🎭',
      label: 'Poses',
      fileSystem: stats.fileSystem.poses,
      asyncStorage: stats.asyncStorage.poses,
      zustand: zustandCounts.poses,
    },
    {
      type: 'selfies' as FilterType,
      icon: '🤳',
      label: 'Selfies',
      fileSystem: stats.fileSystem.selfies,
      asyncStorage: stats.asyncStorage.selfies,
      zustand: zustandCounts.selfies,
    },
    {
      type: 'creations' as FilterType,
      icon: '✨',
      label: 'Creations',
      fileSystem: stats.fileSystem.creations,
      asyncStorage: stats.asyncStorage.creations,
      zustand: zustandCounts.creations,
    },
  ]

  const handleRefresh = async () => {
    await refreshStats()
    if (showUrlList) {
      await loadFileSystemObjects()
    }
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const toggleUrlList = () => {
    setShowUrlList(!showUrlList)
  }

  if (stats.isLoading) {
    return (
      <Card variant="info" className={`mb-4 ${className}`}>
        <View className="flex-row items-center justify-center py-2">
          <Text className="text-blue-600">Loading stats...</Text>
        </View>
      </Card>
    )
  }

  if (stats.error) {
    return (
      <Card variant="danger" className={`mb-4 ${className}`}>
        <View className="flex-row items-center justify-between">
          <Text className="flex-1 text-red-600">Error: {stats.error}</Text>
          <Pressable onPress={handleRefresh} className="ml-2">
            <Icon family={ICON_FAMILY_NAME.Feather} name="refresh-cw" size={16} color="#dc2626" />
          </Pressable>
        </View>
      </Card>
    )
  }

  return (
    <Card variant="default" className={`mb-4 ${className}`}>
      {/* Header with toggle */}
      <Pressable onPress={toggleExpanded} className="mb-3 flex-row items-center justify-between">
        <Text className="text-lg font-semibold text-gray-800">📊 File Statistics</Text>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={toggleUrlList}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="list"
              size={16}
              color={showUrlList ? '#3b82f6' : '#6b7280'}
            />
          </Pressable>
          <Pressable onPress={handleRefresh}>
            <Icon family={ICON_FAMILY_NAME.Feather} name="refresh-cw" size={16} color="#6b7280" />
          </Pressable>
          <Icon
            family={ICON_FAMILY_NAME.Feather}
            name={isExpanded ? 'chevron-up' : 'chevron-down'}
            size={16}
            color="#6b7280"
          />
        </View>
      </Pressable>

      {/* Legend */}
      <View className="mb-3 flex-row justify-end gap-4">
        <View className="items-center">
          <Text className="text-xs font-semibold text-gray-500">FS</Text>
          <Text className="text-xs text-gray-400">FileSystem</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold text-gray-500">AS</Text>
          <Text className="text-xs text-gray-400">AsyncStorage</Text>
        </View>
        <View className="items-center">
          <Text className="text-xs font-semibold text-gray-500">ZS</Text>
          <Text className="text-xs text-gray-400">Zustand</Text>
        </View>
      </View>

      {isExpanded ? (
        // Expanded: Show all categories
        <View className="gap-2">
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium text-gray-600">All Categories:</Text>
            {allStats.map((stat) => (
              <StatRow
                key={stat.type}
                icon={stat.icon}
                label={stat.label}
                fileSystem={stat.fileSystem}
                asyncStorage={stat.asyncStorage}
                zustand={stat.zustand}
                isActive={stat.type === activeFilter}
              />
            ))}
          </View>

          {/* Total Summary */}
          <View className="mt-2 border-t border-gray-200 pt-3">
            <StatRow
              icon="📁"
              label="Total FileSystem"
              fileSystem={stats.fileSystem.total}
              asyncStorage={
                stats.asyncStorage.poses + stats.asyncStorage.selfies + stats.asyncStorage.creations
              }
              zustand={zustandCounts.poses + zustandCounts.selfies + zustandCounts.creations}
            />
            {stats.fileSystem.others > 0 && (
              <View className="mt-2">
                <StatRow
                  icon="📄"
                  label="Other Files"
                  fileSystem={stats.fileSystem.others}
                  asyncStorage={0}
                  zustand={0}
                />
              </View>
            )}
          </View>
        </View>
      ) : (
        // Collapsed: Show only active filter details + summary
        <View className="gap-2">
          <View className="mb-3">
            <Text className="mb-2 text-sm font-medium text-gray-600">
              Current Filter ({activeFilter}):
            </Text>
            {allStats
              .filter((stat) => stat.type === activeFilter)
              .map((stat) => (
                <StatRow
                  key={stat.type}
                  icon={stat.icon}
                  label={stat.label}
                  fileSystem={stat.fileSystem}
                  asyncStorage={stat.asyncStorage}
                  zustand={stat.zustand}
                  isActive={true}
                />
              ))}
          </View>

          {/* Quick Summary */}
          <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
            <Text className="text-sm text-gray-600">
              Total: {zustandCounts.poses + zustandCounts.selfies + zustandCounts.creations} items
            </Text>
            <Text className="text-xs text-gray-400">Tap to expand all</Text>
          </View>
        </View>
      )}

      {/* FileSystem URLs List */}
      {showUrlList && (
        <View className="mt-4 border-t border-gray-200 pt-4">
          <View className="mb-3 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-gray-700">📋 All FileSystem URLs</Text>
            <Text className="text-xs text-gray-500">{fileSystemFiles.length} items</Text>
          </View>

          {isLoadingObjects ? (
            <View className="flex-row items-center justify-center py-4">
              <Text className="text-blue-600">Loading objects...</Text>
            </View>
          ) : (
            <>
              {fileSystemFiles.length > 0 ? (
                <ScrollView
                  className="max-h-80"
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}>
                  {fileSystemFiles.map((file, index) => (
                    <View key={file.uri || index} className="mb-3 rounded-lg bg-gray-50 p-3">
                      <View className="mb-1 flex-row items-center justify-between">
                        <Text className="text-sm font-semibold text-gray-800">{file.name}</Text>
                        <Text
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            file.type === 'pose'
                              ? 'bg-green-100 text-green-800'
                              : file.type === 'selfie'
                                ? 'bg-blue-100 text-blue-800'
                                : file.type === 'creation'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}>
                          {file.type}
                        </Text>
                      </View>
                      <Text className="text-xs text-blue-600" selectable={true}>
                        {file.uri}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              ) : (
                <View className="flex-row items-center justify-center rounded-lg bg-gray-50 py-6">
                  <Text className="text-gray-500">No files found in FileSystem</Text>
                </View>
              )}
            </>
          )}
        </View>
      )}
    </Card>
  )
}

import { View, Text, Pressable } from 'react-native'
import { useState } from 'react'

import Card from '@/components/ui/Card/Card'
import { Icon } from '@/components/ui/icons/Icon'
import { useAppStores } from '@/stores'
import { useFileSystemStats, getStatsForFilter } from '@/components/ui/StatsFiles/hooks/useFileSystemStats'

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
  <View className={`flex-row items-center justify-between py-2 px-3 rounded-lg ${
    isActive ? 'bg-blue-50' : 'bg-gray-50'
  }`}>
    <View className="flex-row items-center flex-1">
      <Text className="text-xl mr-2">{icon}</Text>
      <Text className={`font-medium ${isActive ? 'text-blue-800' : 'text-gray-700'}`}>
        {label}
      </Text>
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

export default function StatsFiles({ activeFilter, className = '' }: StatsFilesProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { stats, refreshStats } = useFileSystemStats()
  const { pose, selfieChooser, creation } = useAppStores()

  // Get Zustand counts (real-time)
  const zustandCounts = {
    poses: pose.poses.length,
    selfies: selfieChooser.selfies.length,
    creations: creation.creations.length,
  }

  // Note: activeStats could be used for future enhancements
  // const activeStats = getStatsForFilter(stats, activeFilter)

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
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
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
          <Text className="text-red-600 flex-1">Error: {stats.error}</Text>
          <Pressable onPress={handleRefresh} className="ml-2">
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="refresh-cw"
              size={16}
              color="#dc2626"
            />
          </Pressable>
        </View>
      </Card>
    )
  }

  return (
    <Card variant="default" className={`mb-4 ${className}`}>
      {/* Header with toggle */}
      <Pressable onPress={toggleExpanded} className="flex-row items-center justify-between mb-3">
        <Text className="text-lg font-semibold text-gray-800">📊 File Statistics</Text>
        <View className="flex-row items-center gap-2">
          <Pressable onPress={handleRefresh}>
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="refresh-cw"
              size={16}
              color="#6b7280"
            />
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
      <View className="flex-row justify-end mb-3 gap-4">
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
            <Text className="text-sm font-medium text-gray-600 mb-2">All Categories:</Text>
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
          <View className="border-t border-gray-200 pt-3 mt-2">
            <StatRow
              icon="📁"
              label="Total FileSystem"
              fileSystem={stats.fileSystem.total}
              asyncStorage={stats.asyncStorage.poses + stats.asyncStorage.selfies + stats.asyncStorage.creations}
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
            <Text className="text-sm font-medium text-gray-600 mb-2">
              Current Filter ({activeFilter}):
            </Text>
            {allStats
              .filter(stat => stat.type === activeFilter)
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
          <View className="flex-row justify-between items-center bg-gray-50 p-3 rounded-lg">
            <Text className="text-sm text-gray-600">
              Total: {zustandCounts.poses + zustandCounts.selfies + zustandCounts.creations} items
            </Text>
            <Text className="text-xs text-gray-400">Tap to expand all</Text>
          </View>
        </View>
      )}
    </Card>
  )
}
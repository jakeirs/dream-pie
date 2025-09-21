import { View, Text, TouchableOpacity } from 'react-native'
import { FilterType } from '@/types/dream/gallery'
import { brandColors } from '@/shared/theme'

interface FilterPill {
  type: FilterType
  label: string
  count: number
}

interface FilterPillsProps {
  filters: FilterPill[]
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
  className?: string
}

export default function FilterPills({
  filters,
  activeFilter,
  onFilterChange,
  className = ''
}: FilterPillsProps) {
  return (
    <View className={`flex-row justify-center space-x-3 px-4 py-3 ${className}`}>
      {filters.map((filter) => {
        const isActive = filter.type === activeFilter

        return (
          <TouchableOpacity
            key={filter.type}
            onPress={() => onFilterChange(filter.type)}
            className={`flex-row items-center rounded-full px-4 py-2 ${
              isActive ? 'bg-primary' : 'bg-cardSecondary'
            }`}
            style={{
              backgroundColor: isActive ? brandColors.primary : brandColors.cardSecondary,
            }}>
            <Text
              className={`font-semibold ${
                isActive ? 'text-primaryForeground' : 'text-textSecondary'
              }`}
              style={{
                color: isActive ? brandColors.primaryForeground : brandColors.textSecondary,
              }}>
              {filter.label}
            </Text>
            {filter.count > 0 && (
              <View
                className={`ml-2 rounded-full px-2 py-1 ${
                  isActive ? 'bg-primaryForeground' : 'bg-background'
                }`}
                style={{
                  backgroundColor: isActive
                    ? brandColors.primaryForeground
                    : brandColors.background,
                  minWidth: 20,
                  height: 20,
                }}>
                <Text
                  className={`text-xs font-bold ${
                    isActive ? 'text-primary' : 'text-textPrimary'
                  }`}
                  style={{
                    color: isActive ? brandColors.primary : brandColors.textPrimary,
                    textAlign: 'center',
                    lineHeight: 12,
                  }}>
                  {filter.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
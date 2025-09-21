import { View, Text } from 'react-native'

import GalleryFilters from './Top/GalleryFilters'

import { FilterType } from '@/types/dream/gallery'
import { FilterPill } from '../hooks/useGalleryFilters'

interface TopProps {
  filters: FilterPill[]
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function Top({ filters, activeFilter, onFilterChange }: TopProps) {
  return (
    <View className="pb-4">
      <GalleryFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
    </View>
  )
}
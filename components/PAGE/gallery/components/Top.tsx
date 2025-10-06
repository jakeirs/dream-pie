import { View } from 'react-native'

import GalleryFilters from './Top/GalleryFilters'
import StatsFiles from '@/components/ui/StatsFiles/StatsFiles'

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
      {/* <StatsFiles activeFilter={activeFilter} /> */}
      <GalleryFilters
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
      />
    </View>
  )
}

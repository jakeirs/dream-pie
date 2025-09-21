import FilterPills from '@/components/ui/FilterPills/FilterPills'

import { FilterType } from '@/types/dream/gallery'
import { FilterPill } from '../../hooks/useGalleryFilters'

interface GalleryFiltersProps {
  filters: FilterPill[]
  activeFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export default function GalleryFilters({
  filters,
  activeFilter,
  onFilterChange,
}: GalleryFiltersProps) {
  return (
    <FilterPills
      filters={filters}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
    />
  )
}
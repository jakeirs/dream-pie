import { useState } from 'react'

import { useAppStores } from '@/stores'

import { FilterType, GalleryContent } from '@/types/dream/gallery'

export interface FilterPill {
  type: FilterType
  label: string
  count: number
}

export interface UseGalleryFilters {
  activeFilter: FilterType
  setActiveFilter: (filter: FilterType) => void
  filters: FilterPill[]
  currentItems: GalleryContent[]
}

export const useGalleryFilters = (): UseGalleryFilters => {
  const { creation, pose, selfieChooser } = useAppStores()
  const [activeFilter, setActiveFilter] = useState<FilterType>('creations')

  // Get current items based on active filter
  const getCurrentItems = (): GalleryContent[] => {
    switch (activeFilter) {
      case 'creations':
        return creation.creations
      case 'poses':
        return pose.poses
      case 'selfies':
        return selfieChooser.selfies
      default:
        return []
    }
  }

  // Prepare filter data with counts
  const filters: FilterPill[] = [
    {
      type: 'creations',
      label: 'Creations',
      count: creation.creations.length,
    },
    {
      type: 'poses',
      label: 'Poses',
      count: pose.poses.length,
    },
    {
      type: 'selfies',
      label: 'Selfies',
      count: selfieChooser.selfies.length,
    },
  ]

  const currentItems = getCurrentItems()

  return {
    activeFilter,
    setActiveFilter,
    filters,
    currentItems,
  }
}
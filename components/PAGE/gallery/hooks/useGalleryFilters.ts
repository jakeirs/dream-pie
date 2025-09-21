import { useState } from 'react'

import { useCreationStore, usePoseStore, useSelfieChooserStore } from '@/stores'

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
  // Use selectors for optimal performance - only subscribe to needed data
  const creations = useCreationStore((state) => state.creations)
  const poses = usePoseStore((state) => state.poses)
  const selfies = useSelfieChooserStore((state) => state.selfies)

  // Count-only selectors for filter pills (most optimal)
  const creationsCount = useCreationStore((state) => state.creations.length)
  const posesCount = usePoseStore((state) => state.poses.length)
  const selfiesCount = useSelfieChooserStore((state) => state.selfies.length)
  const [activeFilter, setActiveFilter] = useState<FilterType>('creations')

  // Get current items based on active filter (using selector data)
  const getCurrentItems = (): GalleryContent[] => {
    switch (activeFilter) {
      case 'creations':
        return creations
      case 'poses':
        return poses
      case 'selfies':
        return selfies
      default:
        return []
    }
  }

  // Prepare filter data with counts (using count-only selectors)
  const filters: FilterPill[] = [
    {
      type: 'creations',
      label: 'Creations',
      count: creationsCount,
    },
    {
      type: 'poses',
      label: 'Poses',
      count: posesCount,
    },
    {
      type: 'selfies',
      label: 'Selfies',
      count: selfiesCount,
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
import { View } from 'react-native'

import GalleryContent from './Bottom/GalleryContent'
import EmptyState from './Bottom/EmptyState'

import { GalleryContent as GalleryContentType, FilterType } from '@/types/dream/gallery'
import { DisplayData } from '../hooks/useGallery'

interface BottomProps {
  currentItems: GalleryContentType[]
  activeFilter: FilterType
  isLoading: boolean
  onCardPress: (item: GalleryContentType) => void
  getItemDisplayData: (item: GalleryContentType) => DisplayData
}

export function Bottom({
  currentItems,
  activeFilter,
  isLoading,
  onCardPress,
  getItemDisplayData,
}: BottomProps) {
  const showEmptyState = !isLoading && currentItems.length === 0

  return (
    <View className="flex-1">
      {showEmptyState ? (
        <EmptyState activeFilter={activeFilter} />
      ) : (
        <GalleryContent
          items={currentItems}
          onCardPress={onCardPress}
          getItemDisplayData={getItemDisplayData}
          isLoading={isLoading}
        />
      )}
    </View>
  )
}
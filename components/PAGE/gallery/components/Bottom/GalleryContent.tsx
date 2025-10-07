import { useMemo } from 'react'
import { FlashList } from '@shopify/flash-list'

import GalleryItem from './GalleryItem'

import { GalleryContent as GalleryContentType } from '@/types/dream/gallery'
import { DisplayData } from '../../hooks/useGallery'

interface GalleryContentProps {
  items: GalleryContentType[]
  onCardPress: (item: GalleryContentType) => void
  getItemDisplayData: (item: GalleryContentType) => DisplayData
  isLoading: boolean
}

export default function GalleryContent({
  items,
  onCardPress,
  getItemDisplayData,
  isLoading,
}: GalleryContentProps) {
  // Sort items by date (most recent first)
  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      const dateA = 'generatedAt' in a ? a.generatedAt : a.createdAt
      const dateB = 'generatedAt' in b ? b.generatedAt : b.createdAt
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
  }, [items])
  const renderGalleryItem = ({ item }: { item: GalleryContentType }) => {
    const displayData = getItemDisplayData(item)

    return <GalleryItem onPress={() => onCardPress(item)} displayData={displayData} />
  }
  const keyExtractor = (item: GalleryContentType, index: number) => {
    if ('id' in item) {
      return item.id
    }

    return `gallery-item-${index}`
  }

  if (isLoading) {
    // Could add a loading skeleton here in the future
    return null
  }

  return (
    <FlashList
      data={sortedItems}
      renderItem={renderGalleryItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      className="px-4 pb-8"
      contentContainerStyle={{
        paddingBottom: 40,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}

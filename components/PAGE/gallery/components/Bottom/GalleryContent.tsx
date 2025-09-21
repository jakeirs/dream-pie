import { FlatList } from 'react-native'

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
  const renderGalleryItem = ({ item }: { item: GalleryContentType }) => {
    const displayData = getItemDisplayData(item)

    return (
      <GalleryItem
        item={item}
        onPress={() => onCardPress(item)}
        displayData={displayData}
      />
    )
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
    <FlatList
      data={items}
      renderItem={renderGalleryItem}
      keyExtractor={keyExtractor}
      numColumns={2}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 32,
      }}
      showsVerticalScrollIndicator={false}
    />
  )
}
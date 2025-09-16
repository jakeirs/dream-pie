import React, { useRef, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import { BottomSheet, PageHeader, ICON_FAMILY_NAME } from '@/components/ui'
import { brandColors } from '@/shared/theme'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { router } from 'expo-router'
import GalleryCardModal from '@/components/PAGE/gallery-card-modal'

// Mock gallery data
const mockGalleryItems = [
  {
    id: '1',
    imageUri: 'https://picsum.photos/300/400?random=1',
    title: 'Dream Portrait #1',
    description: 'A beautiful portrait with magical background enhancement.',
  },
  {
    id: '2',
    imageUri: 'https://picsum.photos/300/400?random=2',
    title: 'Fantasy Scene #2',
    description: 'Professional photo with stunning lighting effects.',
  },
  {
    id: '3',
    imageUri: 'https://picsum.photos/300/400?random=3',
    title: 'AI Enhanced #3',
    description: 'Creative composition with dream-like atmosphere.',
  },
  {
    id: '4',
    imageUri: 'https://picsum.photos/300/400?random=4',
    title: 'Artistic Shot #4',
    description: 'Modern portrait with perfect color grading.',
  },
  {
    id: '5',
    imageUri: 'https://picsum.photos/300/400?random=5',
    title: 'Creative Vision #5',
    description: 'Unique perspective with professional editing.',
  },
  {
    id: '6',
    imageUri: 'https://picsum.photos/300/400?random=6',
    title: 'Masterpiece #6',
    description: 'Outstanding result with AI-powered enhancement.',
  },
]

interface GalleryItem {
  id: string
  imageUri: string
  title: string
  description: string
}

export default function GalleryPage() {
  const modalRef = useRef<BottomSheetModal>(null)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)

  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 48) / 2 // 2 columns with padding

  const handleSettingsPress = () => {
    router.push('/settings')
  }

  const handleCardPress = (item: GalleryItem) => {
    setSelectedItem(item)
    modalRef.current?.present()
  }

  const renderGalleryItem = ({ item }: { item: GalleryItem }) => (
    <TouchableOpacity
      onPress={() => handleCardPress(item)}
      className="mb-4"
      style={{ width: cardWidth }}>
      <View className="overflow-hidden rounded-xl bg-cardSecondary">
        <Image
          source={{ uri: item.imageUri }}
          style={{
            width: '100%',
            height: 220,
            resizeMode: 'cover',
          }}
        />
        <View className="p-3">
          <Text className="font-bold text-textPrimary" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-xs text-textSecondary" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-background">
      <PageHeader
        title="My Gallery"
        rightIcon={{
          name: 'settings',
          family: ICON_FAMILY_NAME.Feather,
          onPress: handleSettingsPress,
        }}
      />
      {/* Empty state or content */}
      {mockGalleryItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-2xl font-bold text-textPrimary">
            Your Gallery is Empty
          </Text>
          <Text className="text-center text-textSecondary">
            Create your first photo to see it here!
          </Text>
        </View>
      ) : (
        <FlatList
          data={mockGalleryItems}
          renderItem={renderGalleryItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Gallery Card Modal */}
      <BottomSheet ref={modalRef} isModal={true} scrollView={true}>
        {selectedItem && (
          <GalleryCardModal
            imageUri={selectedItem.imageUri}
            title={selectedItem.title}
            description={selectedItem.description}
            onClose={() => modalRef.current?.dismiss()}
          />
        )}
      </BottomSheet>
    </View>
  )
}
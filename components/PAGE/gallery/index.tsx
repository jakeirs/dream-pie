import { View, Text, FlatList, TouchableOpacity, Dimensions } from 'react-native'
import { useRef, useState, useEffect } from 'react'
import { router } from 'expo-router'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import { Image, useImage } from 'expo-image'

import BottomSheet from '@/components/ui/BottomSheet/BottomSheet'
import PageHeader from '@/components/ui/PageHeader/PageHeader'
import FilterPills from '@/components/ui/FilterPills/FilterPills'
import GalleryCardModal from '@/components/PAGE/gallery-card-modal'

import { useAppStores } from '@/stores'

import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'
import { FilterType, GalleryContent } from '@/types/dream/gallery'
import { Creation, Pose, Selfie } from '@/types/dream'
import { mockPoses } from '@/mockData/dream/poses'
import { mockSelfies } from '@/mockData/dream/selfies'

export default function GalleryPage() {
  const { creation, pose, selfieChooser } = useAppStores()
  const modalRef = useRef<BottomSheetModal>(null)
  const [selectedItem, setSelectedItem] = useState<GalleryContent | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterType>('creations')

  const screenWidth = Dimensions.get('window').width
  const cardWidth = (screenWidth - 48) / 2 // 2 columns with padding

  // Initialize stores on mount
  useEffect(() => {
    creation.loadCreations()
    pose.setPoses(mockPoses)
    selfieChooser.setSelfies(mockSelfies)
  }, [])

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
  const filters = [
    {
      type: 'creations' as FilterType,
      label: 'Creations',
      count: creation.creations.length,
    },
    {
      type: 'poses' as FilterType,
      label: 'Poses',
      count: pose.poses.length,
    },
    {
      type: 'selfies' as FilterType,
      label: 'Selfies',
      count: selfieChooser.selfies.length,
    },
  ]

  const currentItems = getCurrentItems()

  const handleSettingsPress = () => {
    router.push('/settings')
  }

  const handleCardPress = (item: GalleryContent) => {
    setSelectedItem(item)
    modalRef.current?.present()
  }

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter)
  }

  // Get display data for different item types
  const getItemDisplayData = (item: GalleryContent) => {
    if ('resultImage' in item) {
      // Creation type
      const creation = item as Creation
      return {
        imageUri: creation.resultImage,
        title: `${creation.usedPose.name} Creation`,
        description: `Created with ${creation.usedPose.name} pose using ${creation.usedSelfie.name}`,
      }
    } else if ('category' in item && 'isPremium' in item) {
      // Pose type
      const pose = item as Pose
      return {
        imageUri: pose.imageUrl,
        title: pose.name,
        description: pose.description,
      }
    } else {
      // Selfie type
      const selfie = item as Selfie
      return {
        imageUri: selfie.imageUrl,
        title: selfie.name,
        description: selfie.description,
      }
    }
  }

  // Gallery Item Component with useImage hook
  const GalleryItemComponent = ({ item, onPress }: { item: GalleryContent, onPress: () => void }) => {
    const displayData = getItemDisplayData(item)
    const image = useImage(displayData.imageUri)

    return (
      <TouchableOpacity
        onPress={onPress}
        className="mb-4"
        style={{ width: cardWidth }}>
        <View className="overflow-hidden rounded-xl bg-cardSecondary">
          {image && (
            <Image
              source={image}
              style={{
                width: '100%',
                height: 220,
              }}
              contentFit="cover"
            />
          )}
          <View className="p-3">
            <Text className="font-bold text-textPrimary" numberOfLines={1}>
              {displayData.title}
            </Text>
            <Text className="text-xs text-textSecondary" numberOfLines={2}>
              {displayData.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  const renderGalleryItem = ({ item }: { item: GalleryContent }) => (
    <GalleryItemComponent item={item} onPress={() => handleCardPress(item)} />
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

      {/* Filter Pills */}
      <FilterPills
        filters={filters}
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Content */}
      {currentItems.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <Text className="mb-4 text-center text-2xl font-bold text-textPrimary">
            No {filters.find(f => f.type === activeFilter)?.label} Yet
          </Text>
          <Text className="text-center text-textSecondary">
            {activeFilter === 'creations' && 'Create your first photo to see it here!'}
            {activeFilter === 'poses' && 'Browse poses to add to your collection!'}
            {activeFilter === 'selfies' && 'Add selfies to use in your creations!'}
          </Text>
        </View>
      ) : (
        <FlatList
          data={currentItems}
          renderItem={renderGalleryItem}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          key={activeFilter} // Force re-render when filter changes
        />
      )}

      {/* Gallery Card Modal */}
      <BottomSheet ref={modalRef} isModal={true} scrollView={true}>
        {selectedItem && (
          <GalleryCardModal
            imageUri={getItemDisplayData(selectedItem).imageUri}
            title={getItemDisplayData(selectedItem).title}
            description={getItemDisplayData(selectedItem).description}
            onClose={() => modalRef.current?.dismiss()}
          />
        )}
      </BottomSheet>
    </View>
  )
}
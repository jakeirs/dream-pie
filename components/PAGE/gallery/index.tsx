import { useRef } from 'react'
import { View, ScrollView } from 'react-native'
import { router } from 'expo-router'

import type { GestureType } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/gesture'

import BottomSheet from '@/components/ui/BottomSheet/BottomSheet'
import PageHeader from '@/components/ui/PageHeader/PageHeader'
import GalleryCardModal from '@/components/PAGE/gallery-card-modal'
import { Top } from './components/Top'
import { Bottom } from './components/Bottom'

import { useGallery } from './hooks/useGallery'
import { useGalleryFilters } from './hooks/useGalleryFilters'

import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'

export default function GalleryPage() {
  // Custom hooks for clean separation of concerns
  const gallery = useGallery()
  const filters = useGalleryFilters()

  // Ref for coordinating pinch gesture with BottomSheet
  const pinchGestureRef = useRef<GestureType | undefined>(undefined)

  const handleSettingsPress = () => {
    router.push('/settings')
  }

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

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={true}
        contentContainerStyle={{ flexGrow: 1 }}>
        <Top
          filters={filters.filters}
          activeFilter={filters.activeFilter}
          onFilterChange={filters.setActiveFilter}
        />

        {/* Content Section */}
        <Bottom
          currentItems={filters.currentItems}
          activeFilter={filters.activeFilter}
          isLoading={gallery.isLoading}
          onCardPress={gallery.handleCardPress}
          getItemDisplayData={gallery.getItemDisplayData}
        />
      </ScrollView>

      {/* Gallery Card Modal */}
      <BottomSheet
        ref={gallery.modalRef}
        isModal={true}
        scrollView={true}
        simultaneousHandlers={pinchGestureRef}
        activeOffsetY={35}>
        {gallery.selectedItem && (
          <GalleryCardModal
            imageUri={gallery.getItemDisplayData(gallery.selectedItem).imageUri}
            title={gallery.getItemDisplayData(gallery.selectedItem).title}
            description={gallery.getItemDisplayData(gallery.selectedItem).description}
            onClose={gallery.handleModalClose}
            pinchGestureRef={pinchGestureRef}
          />
        )}
      </BottomSheet>
    </View>
  )
}

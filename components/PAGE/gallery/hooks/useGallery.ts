import { useRef, useEffect, useState, useCallback, RefObject } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

import { useCreationStore, usePoseStore, useSelfieChooserStore } from '@/stores'

import { GalleryContent } from '@/types/dream/gallery'
import { Creation, Pose, Selfie } from '@/types/dream'
import { loadItemsFromAsyncStorage } from '@/stores/AsyncStorage/utils'
import { USER_CREATIONS } from '@/stores/AsyncStorage/keys'

export interface DisplayData {
  imageUri: string
  title: string
  description: string
}

export interface UseGallery {
  // Data
  creations: Creation[]
  poses: Pose[]
  selfies: Selfie[]

  // Loading states
  isLoading: boolean

  // Actions
  initializeStores: () => void

  // Modal management
  selectedItem: GalleryContent | null
  modalRef: RefObject<BottomSheetModal | null>
  handleCardPress: (item: GalleryContent) => void
  handleModalClose: () => void

  // Helpers
  getItemDisplayData: (item: GalleryContent) => DisplayData
}

export const useGallery = (): UseGallery => {
  // Use selectors for optimal performance - only subscribe to needed data
  const creations = useCreationStore((state) => state.creations)
  const setCreations = useCreationStore((state) => state.setCreations)
  const poses = usePoseStore((state) => state.poses)
  const selfies = useSelfieChooserStore((state) => state.selfies)
  const isLoading = useCreationStore((state) => state.isLoading)
  const modalRef = useRef<BottomSheetModal>(null)

  const initializeStores = useCallback(async () => {
    // Load user-captured selfies from AsyncStorage
    const userCreations = await loadItemsFromAsyncStorage<Creation>(USER_CREATIONS)

    if (userCreations.length > 0) {
      setCreations(userCreations)
      return
    }
    setCreations([])
  }, [])

  useEffect(() => {
    initializeStores()
  }, [initializeStores])

  // Get display data for different item types
  const getItemDisplayData = (item: GalleryContent): DisplayData => {
    if ('imageUrl' in item && 'usedPose' in item && 'usedSelfie' in item) {
      // Creation type
      const creationItem = item as Creation
      return {
        imageUri: creationItem.imageUrl,
        title: `${creationItem.usedPose.name} Creation`,
        description: `Created with ${creationItem.usedPose.name} pose using ${creationItem.usedSelfie.name}`,
      }
    } else if ('category' in item && 'isPremium' in item) {
      // Pose type
      const poseItem = item as Pose
      return {
        imageUri: poseItem.imageUrl,
        title: poseItem.name,
        description: poseItem.description,
      }
    } else {
      // Selfie type
      const selfieItem = item as Selfie
      return {
        imageUri: selfieItem.imageUrl,
        title: selfieItem.name,
        description: selfieItem.description,
      }
    }
  }

  // Modal management
  const [selectedItem, setSelectedItem] = useState<GalleryContent | null>(null)

  const handleCardPress = (item: GalleryContent) => {
    setSelectedItem(item)
    modalRef.current?.present()
  }

  const handleModalClose = () => {
    modalRef.current?.dismiss()
  }

  return {
    // Data (from selectors)
    creations,
    poses,
    selfies,

    // Loading states (from selector)
    isLoading,

    // Actions
    initializeStores,

    // Modal management
    selectedItem,
    modalRef,
    handleCardPress,
    handleModalClose,

    // Helpers
    getItemDisplayData,
  }
}

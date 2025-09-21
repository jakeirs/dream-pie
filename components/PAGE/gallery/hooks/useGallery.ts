import { useRef, useEffect, useState, RefObject } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

import { useAppStores } from '@/stores'

import { GalleryContent, FilterType } from '@/types/dream/gallery'
import { Creation, Pose, Selfie } from '@/types/dream'
import { mockPoses } from '@/mockData/dream/poses'
import { mockSelfies } from '@/mockData/dream/selfies'

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
  const { creation, pose, selfieChooser } = useAppStores()
  const modalRef = useRef<BottomSheetModal>(null)

  // Initialize stores on mount
  const initializeStores = () => {
    creation.loadCreations()
    pose.setPoses(mockPoses)
    selfieChooser.setSelfies(mockSelfies)
  }

  useEffect(() => {
    initializeStores()
  }, [])

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
    // Data
    creations: creation.creations,
    poses: pose.poses,
    selfies: selfieChooser.selfies,

    // Loading states
    isLoading: creation.isLoading,

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
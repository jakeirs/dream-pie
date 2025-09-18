// Following Import Order Standards (React 19+)
import { useEffect } from 'react'

// Zustand stores with inline selectors for performance
import { useStore, usePoseStore } from '@/stores'
import { useShallow } from 'zustand/react/shallow'

// Mock data
import { mockPoses, mockSubscriptions } from '@/mockData/dream'

// Types
import { Pose } from '@/types/dream'

export const usePoseLibrary = (onClose: () => void) => {
  // ✅ Optimized with useShallow: Prevent unnecessary rerenders when array reference changes
  const { poses, selectedPose } = useStore(
    usePoseStore,
    useShallow((state) => ({
      poses: state.poses,
      selectedPose: state.selectedPose,
    }))
  )

  // Actions don't need shallow comparison
  const setPoses = useStore(usePoseStore, (state) => state.setPoses)
  const setSelectedPose = useStore(usePoseStore, (state) => state.setSelectedPose)

  // Mock subscription (for now, no subscription checking as requested)
  const subscription = mockSubscriptions[0] // Free tier

  // Load poses on mount
  useEffect(() => {
    if (poses.length === 0) {
      setPoses(mockPoses)
    }
  }, [poses.length, setPoses])

  // Handle pose selection with Zustand
  const handlePoseSelect = (selectedPoseItem: Pose) => {
    // Set selected pose in store
    setSelectedPose(selectedPoseItem)

    // Close pose library
    onClose()
  }

  return {
    // Pose data from Zustand store
    poses,
    selectedPose,
    subscription,

    // Actions
    handlePoseSelect,
  }
}

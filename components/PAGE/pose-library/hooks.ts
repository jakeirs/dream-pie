// Following Import Order Standards (React 19+)
import { useEffect } from 'react'

// Zustand stores
import { useAppStores } from '@/stores'

// Mock data
import { mockPoses, mockSubscriptions } from '@/mockData/dream'

// Types
import { Pose } from '@/types/dream'

export const usePoseLibrary = (onClose: () => void) => {
  // Zustand stores
  const { pose } = useAppStores()

  // Mock subscription (for now, no subscription checking as requested)
  const subscription = mockSubscriptions[0] // Free tier

  // Load poses on mount
  useEffect(() => {
    if (pose.poses.length === 0) {
      pose.setPoses(mockPoses)
    }
  }, [])

  // Handle pose selection with Zustand
  const handlePoseSelect = (selectedPose: Pose) => {
    // Set selected pose in store
    pose.setSelectedPose(selectedPose)

    // Close pose library
    onClose()
  }

  return {
    // Pose data from Zustand store
    poses: pose.poses,
    selectedPose: pose.selectedPose,
    subscription,

    // Actions
    handlePoseSelect,
  }
}

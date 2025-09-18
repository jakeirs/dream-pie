// Following Import Order Standards (React 19+)
import { useEffect } from 'react'

// Zustand stores with inline selectors for performance
import { useStore, usePoseStore } from '@/stores'

// Mock data
import { mockPoses } from '@/mockData/dream'

// Types
import { Pose } from '@/types/dream'

export const usePoses = () => {
  // ✅ Optimized with useShallow: Prevent unnecessary rerenders when array reference changes
  const { poses, setPoses } = useStore(usePoseStore)

  // Load poses on mount
  useEffect(() => {
    if (poses.length === 0) {
      setPoses(mockPoses)
    }
  }, [poses.length, setPoses])

  return {
    poses,
  }
}

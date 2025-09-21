import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Pose } from '@/types/dream/pose'
import { syncMockDataWithFileSystem } from './poseStore/syncUtils'

interface PoseStore {
  poses: Pose[] // Poses with file URIs (synced from mockData)
  setPoses: (mockPoses: Pose[]) => Promise<void> // Now async - auto-syncs mockData to file system
  selectedPose: Pose | null
  setSelectedPose: (pose: Pose | null) => void
  reset: () => void
}

export const usePoseStore = create<PoseStore>()(
  devtools(
    (set, get) => ({
      poses: [], // Poses with file URIs (automatically synced from mockData)

      // Main method: Automatically sync mockData to file system
      setPoses: async (mockPoses: Pose[]) => {
        try {
          console.log('🔄 setPoses called - starting automatic sync to file system')

          // Sync mockData poses to file system and get file URIs back
          const syncedPoses = await syncMockDataWithFileSystem(mockPoses)

          // Update store with poses that have file URIs
          set({ poses: syncedPoses }, false, 'setPoses-synced')

          console.log(`✅ setPoses complete - ${syncedPoses.length} poses with file URIs`)
        } catch (error) {
          console.error('❌ Error in setPoses sync:', error)

          // Fallback: set empty array to prevent crashes
          set({ poses: [] }, false, 'setPoses-error')
        }
      },

      selectedPose: null,
      setSelectedPose: (pose) =>
        set(
          {
            selectedPose: pose,
          },
          false,
          'setSelectedPose'
        ),

      reset: () => set({ poses: [], selectedPose: null }),
    }),
    { name: 'pose-store' }
  )
)

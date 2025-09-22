import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Pose } from '@/types/dream/pose'
import { syncWithFileSystemAsyncStorage } from './fileSystem'
import { USER_POSES } from './AsyncStorage/keys'

interface PoseStore {
  poses: Pose[] // Poses with file URIs (synchronized with FileSystem + AsyncStorage)
  setPoses: (incomingPoses: Pose[]) => Promise<void> // Compare AsyncStorage vs incoming poses and sync
  selectedPose: Pose | null
  setSelectedPose: (pose: Pose | null) => void
  reset: () => void
}

export const usePoseStore = create<PoseStore>()(
  devtools(
    (set, get) => ({
      poses: [], // Poses with file URIs (synchronized with FileSystem + AsyncStorage)

      // Main method: Compare AsyncStorage vs incoming poses and synchronize
      setPoses: async (incomingPoses: Pose[]) => {
        try {
          const syncedPoses = await syncWithFileSystemAsyncStorage(
            incomingPoses,
            USER_POSES,
            'pose'
          )
          set({ poses: syncedPoses }, false, 'setPoses-synced')
        } catch (error) {
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

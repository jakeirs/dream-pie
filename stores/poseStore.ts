import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Pose } from '@/types/dream/pose'

interface PoseStore {
  poses: Pose[]
  setPoses: (poses: Pose[]) => void
  selectedPose: Pose | null
  setSelectedPose: (pose: Pose | null) => void
  reset: () => void
}

export const usePoseStore = create<PoseStore>()(
  devtools(
    (set) => ({
      poses: [],
      setPoses: (poses) => set({ poses }, false, 'setPoses'),
      selectedPose: null,
      setSelectedPose: (pose) => set({ selectedPose: pose }, false, 'setSelectedPose'),
      reset: () => set({ poses: [], selectedPose: null }, false, 'reset'),
    }),
    { name: 'pose-store' }
  )
)
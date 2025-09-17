import { create } from 'zustand'
import { Pose } from '@/types/dream'

interface PoseStore {
  poses: Pose[]
  setPoses: (poses: Pose[]) => void
  selectedPose: Pose | null
  setSelectedPose: (pose: Pose | null) => void
  reset: () => void
}

export const usePoseStore = create<PoseStore>((set) => ({
  poses: [],
  setPoses: (poses) => set({ poses }),
  selectedPose: null,
  setSelectedPose: (pose) => set({ selectedPose: pose }),
  reset: () => set({ poses: [], selectedPose: null }),
}))
import { Pose } from '@/types/dream'

export interface PoseLibraryPageProps {
  onClose: () => void
}

export interface PoseLibraryState {
  poses: Pose[]
  selectedPose: Pose | null
  isLoading: boolean
}

export interface PoseGridProps {
  poses: Pose[]
  onPoseSelect: (pose: Pose) => void
}

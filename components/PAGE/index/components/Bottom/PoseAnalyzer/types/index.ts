import { Pose } from '@/types/dream/pose'

export interface PoseAnalyzerState {
  isAnalyzing: boolean
  analyzeResult: string | null
  error: string | null
}

export interface AnalyzeButtonProps {
  onPress: () => void
  isAnalyzing: boolean
  disabled: boolean
  selectedPose: Pose
}

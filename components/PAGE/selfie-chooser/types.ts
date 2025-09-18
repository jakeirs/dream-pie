import { Selfie } from '@/types/dream/selfie'

export interface SelfieChooserPageProps {
  onClose: () => void
}

export interface SelfieChooserState {
  selfies: Selfie[]
  selectedSelfie: Selfie | null
  isLoading: boolean
}

export interface SelfieGridProps {
  selfies: Selfie[]
  onSelfieSelect: (selfie: Selfie) => void
}
import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Selfie } from '@/types/dream/selfie'

interface SelfieChooserStore {
  selfies: Selfie[]
  setSelfies: (selfies: Selfie[]) => void
  selectedSelfie: Selfie | null
  setSelectedSelfie: (selfie: Selfie | null) => void
  reset: () => void
}

export const useSelfieChooserStore = create<SelfieChooserStore>()(
  devtools(
    (set) => ({
      selfies: [],
      setSelfies: (selfies) => set({ selfies }, false, 'setSelfies'),
      selectedSelfie: null,
      setSelectedSelfie: (selfie) =>
        set(
          {
            selectedSelfie: selfie,
          },
          false,
          'setSelectedSelfie'
        ),
      reset: () => set({ selfies: [], selectedSelfie: null }),
    }),
    { name: 'selfie-chooser-store' }
  )
)
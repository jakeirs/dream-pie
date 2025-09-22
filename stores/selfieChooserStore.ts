import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Selfie } from '@/types/dream/selfie'
import { syncWithFileSystemAsyncStorage } from './fileSystem/syncWithFileSystemAsyncStorage'
import { USER_SELFIES } from './AsyncStorage/keys'

interface SelfieChooserStore {
  selfies: Selfie[] // Selfies with file URIs (synchronized with FileSystem + AsyncStorage)
  setSelfies: (incomingSelfies: Selfie[]) => Promise<void> // Compare AsyncStorage vs incoming selfies and sync
  selectedSelfie: Selfie | null
  setSelectedSelfie: (selfie: Selfie | null) => void
  deleteMode: boolean
  setDeleteMode: (active: boolean) => void
  selectedToDelete: string[]
  toggleSelectedToDelete: (id: string) => void
  clearSelectedToDelete: () => void
  reset: () => void
}

export const useSelfieChooserStore = create<SelfieChooserStore>()(
  devtools(
    (set, get) => ({
      selfies: [], // Selfies with file URIs (synchronized with FileSystem + AsyncStorage)

      // Main method: Compare AsyncStorage vs incoming selfies and synchronize
      setSelfies: async (incomingSelfies: Selfie[]) => {
        try {
          console.log('🔄 setSelfies called - starting FileSystem + AsyncStorage sync')

          // Sync incoming selfies with FileSystem + AsyncStorage using new logic
          const syncedSelfies = await syncWithFileSystemAsyncStorage(incomingSelfies, USER_SELFIES, 'selfie')

          // Update store with synchronized selfies (all have file URIs)
          set({ selfies: syncedSelfies }, false, 'setSelfies-synced')

          console.log(`✅ setSelfies complete - ${syncedSelfies.length} selfies synchronized`)
        } catch (error) {
          console.error('❌ Error in setSelfies sync:', error)

          // Fallback: set empty array to prevent crashes
          set({ selfies: [] }, false, 'setSelfies-error')
        }
      },

      selectedSelfie: null,
      setSelectedSelfie: (selfie) =>
        set(
          {
            selectedSelfie: selfie,
          },
          false,
          'setSelectedSelfie'
        ),
      deleteMode: false,
      setDeleteMode: (active) => set({ deleteMode: active }, false, 'setDeleteMode'),
      selectedToDelete: [],
      toggleSelectedToDelete: (id) => {
        const current = get().selectedToDelete
        const isSelected = current.includes(id)
        const updated = isSelected
          ? current.filter(selectedId => selectedId !== id)
          : [...current, id]
        set({ selectedToDelete: updated }, false, 'toggleSelectedToDelete')
      },
      clearSelectedToDelete: () => set({ selectedToDelete: [] }, false, 'clearSelectedToDelete'),
      reset: () => set({
        selfies: [],
        selectedSelfie: null,
        deleteMode: false,
        selectedToDelete: []
      }),
    }),
    { name: 'selfie-chooser-store' }
  )
)
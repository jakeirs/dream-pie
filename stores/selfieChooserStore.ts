import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Selfie } from '@/types/dream/selfie'
import { syncMockDataWithFileSystem } from './fileSystem/syncMockDataWithFileSystem'
import { USER_SELFIES } from './AsyncStorage/keys'

interface SelfieChooserStore {
  selfies: Selfie[] // Selfies with file URIs (synced from mockData)
  setSelfies: (mockSelfies: Selfie[]) => Promise<void> // Now async - auto-syncs mockData to file system
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
      selfies: [], // Selfies with file URIs (automatically synced from mockData)

      // Main method: Automatically sync mockData to file system
      setSelfies: async (mockSelfies: Selfie[]) => {
        try {
          console.log('🔄 setSelfies called - starting automatic sync to file system')

          // Sync mockData selfies to file system using universal function with AsyncStorage key
          const syncedSelfies = await syncMockDataWithFileSystem(mockSelfies, USER_SELFIES, 'selfie')

          // Update store with selfies that have file URIs
          set({ selfies: syncedSelfies }, false, 'setSelfies-synced')

          console.log(`✅ setSelfies complete - ${syncedSelfies.length} selfies with file URIs`)
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
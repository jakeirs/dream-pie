import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Selfie } from '@/types/dream/selfie'
import { addToFileSystemAsyncStorage, deleteItemFromFileSystem } from './fileSystem'
import { USER_SELFIES } from './AsyncStorage/keys'

interface SelfieChooserStore {
  selfies: Selfie[] // Selfies with file URIs (synchronized with FileSystem + AsyncStorage)
  setSelfies: (incomingSelfies: Selfie[]) => Promise<void> // Compare AsyncStorage vs incoming selfies and sync
  addSelfieAndWait: (newSelfie: Selfie) => Promise<Selfie> // Process single selfie and return with permanent URI
  deleteSelfiesAndWait: (selfieIds: string[]) => Promise<Selfie[]> // Delete specific selfies and return remaining
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
      selfies: [],
      setSelfies: (incomingSelfies: Selfie[]) => {
        set({ selfies: incomingSelfies }, false, 'setSelfies-start')
      },

      // Process single selfie through file system and add to store
      addSelfieAndWait: async (newSelfie: Selfie) => {
        // Process single selfie through file system to get permanent URI
        const processedSelfie = await addToFileSystemAsyncStorage(newSelfie, USER_SELFIES, 'selfie')

        // Add processed selfie to beginning of existing array
        const currentSelfies = get().selfies
        const updatedSelfies = [processedSelfie, ...currentSelfies]

        set({ selfies: updatedSelfies }, false, 'addSelfieAndWait-success')

        return processedSelfie
      },

      // Delete specific selfies efficiently - preserves existing references
      deleteSelfiesAndWait: async (selfieIds: string[]) => {
        // Use bulk delete function for better performance and consistency
        await deleteItemFromFileSystem(selfieIds, USER_SELFIES)

        // Preserve existing references - only remove deleted items
        const currentSelfies = get().selfies
        const remainingSelfies = currentSelfies.filter((selfie) => !selfieIds.includes(selfie.id))

        set({ selfies: remainingSelfies }, false, 'deleteSelfiesAndWait-success')

        return remainingSelfies
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
          ? current.filter((selectedId) => selectedId !== id)
          : [...current, id]
        set({ selectedToDelete: updated }, false, 'toggleSelectedToDelete')
      },
      clearSelectedToDelete: () => set({ selectedToDelete: [] }, false, 'clearSelectedToDelete'),
      reset: () =>
        set({
          selfies: [],
          selectedSelfie: null,
          deleteMode: false,
          selectedToDelete: [],
        }),
    }),
    { name: 'selfie-chooser-store' }
  )
)

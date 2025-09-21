/**
 * CREATION STORE LIFECYCLE - Dream Pie AI Generation Results
 *
 * WHEN CREATED: User completes AI generation, result processing success
 * WHERE CREATED: photoGenerationStore completion, successful AI generation
 *
 * WHEN USED: Gallery display, creation browsing, result management
 * WHERE USED: GalleryPage, creation viewing components, gallery filters
 *
 * HOW DATA EVOLVES:
 * - CREATE: New creations added from successful AI generations
 * - READ: Gallery browsing, creation display, filter-based views
 * - UPDATE: Creation metadata updates (future: favorites, tags)
 * - DELETE: User removes creations from gallery
 *
 * RELATIONSHIPS:
 * - PhotoGeneration: photoGeneration.result -> creation (one-to-one conversion)
 * - Poses: creation.usedPose -> poses (embedded reference)
 * - Selfies: creation.usedSelfie -> selfies (embedded reference)
 * - Gallery: Direct display in gallery filters
 */

import { create } from 'zustand'
import { devtools } from '@csark0812/zustand-expo-devtools'
import { Creation } from '@/types/dream'

interface CreationStore {
  // State
  creations: Creation[]
  isLoading: boolean

  // Actions
  setCreations: (mockCreations: Creation[]) => void
  addCreation: (creation: Creation) => void
  removeCreation: (id: string) => void
  reset: () => void
}

export const useCreationStore = create<CreationStore>()(
  devtools(
    (set, get) => ({
      // Initial State
      creations: [],
      isLoading: false,

      // Set Creations - Initialize from mock data (consistent with pose/selfie pattern)
      setCreations: (mockCreations: Creation[]) => {
        set(
          {
            creations: mockCreations,
            isLoading: false,
          },
          false,
          'setCreations'
        )
      },

      // Add New Creation - From successful generation
      addCreation: (creation) =>
        set(
          (state) => ({
            creations: [creation, ...state.creations], // Add to beginning for newest-first order
          }),
          false,
          'addCreation'
        ),

      // Remove Creation - User deletion
      removeCreation: (id) =>
        set(
          (state) => ({
            creations: state.creations.filter((c) => c.id !== id),
          }),
          false,
          'removeCreation'
        ),

      // Reset - Clear all state
      reset: () =>
        set(
          {
            creations: [],
            isLoading: false,
          },
          false,
          'reset'
        ),
    }),
    { name: 'creation-store' }
  )
)

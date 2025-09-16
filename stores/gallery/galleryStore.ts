/**
 * ZUSTAND STORE LIFECYCLE - Gallery Store
 *
 * STATE PURPOSE: Manages user's saved creations, gallery browsing, and organization
 * WHEN CREATED: User saves first creation, gallery tab access
 * WHERE CREATED: Result screen save action, gallery tab initialization
 *
 * WHEN UPDATED: New creation saves, deletions, sorting changes
 * WHERE UPDATED: ResultPage save action, GalleryPage interactions
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Load user's saved creations from storage
 * - READ: Gallery display, creation browsing, statistics
 * - UPDATE: Save new creations, delete items, reorder/sort
 * - PERSIST: All saved creations, user preferences
 * - RESET: Account deletion, data reset
 *
 * RELATIONSHIPS:
 * - Receives new creations from generationStore
 * - Provides creations to resultStore for detail viewing
 * - Connected to userStore for ownership filtering
 * SIDE EFFECTS: Storage updates, gallery UI updates, statistics changes
 */

import { create } from 'zustand'
import { Creation } from '@/types/dream'
import { mockCreations, getCompletedCreations } from '@/mockData/dream'

interface GalleryState {
  // Gallery data
  savedCreations: Creation[]
  selectedCreation: Creation | null

  // Filtering and sorting
  sortBy: 'date' | 'category' | 'name'
  sortOrder: 'asc' | 'desc'
  filterCategory: string | 'all'

  // UI states
  isLoading: boolean
  viewMode: 'grid' | 'list'

  // Actions
  loadGallery: (userId: string) => Promise<void>
  saveCreation: (creation: Creation) => void
  deleteCreation: (id: string) => void
  selectCreation: (creation: Creation) => void
  clearSelection: () => void

  // Filtering and sorting
  setSortBy: (sortBy: GalleryState['sortBy']) => void
  setSortOrder: (order: GalleryState['sortOrder']) => void
  setFilterCategory: (category: string) => void
  setViewMode: (mode: GalleryState['viewMode']) => void

  // Helpers
  getCreationsByCategory: (category: string) => Creation[]
  getCreationsCount: () => number
  getLatestCreation: () => Creation | null
  getFavoriteCategory: () => string
}

export const useGalleryStore = create<GalleryState>((set, get) => ({
      savedCreations: mockCreations.filter(c => c.status === 'completed'), // Start with mock data
      selectedCreation: null,

      sortBy: 'date',
      sortOrder: 'desc',
      filterCategory: 'all',

      isLoading: false,
      viewMode: 'grid',

      loadGallery: async (userId) => {
        set({ isLoading: true })

        try {
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500))

          // In real app, this would fetch from API
          const userCreations = getCompletedCreations(userId)

          set({
            savedCreations: userCreations,
            isLoading: false
          })
        } catch (error) {
          set({ isLoading: false })
        }
      },

      saveCreation: (creation) => set((state) => {
        // Check if creation already exists
        const exists = state.savedCreations.some(c => c.id === creation.id)
        if (exists) return state

        const newCreations = [creation, ...state.savedCreations]
        return { savedCreations: newCreations }
      }),

      deleteCreation: (id) => set((state) => ({
        savedCreations: state.savedCreations.filter(c => c.id !== id),
        selectedCreation: state.selectedCreation?.id === id ? null : state.selectedCreation
      })),

      selectCreation: (creation) => set({ selectedCreation: creation }),

      clearSelection: () => set({ selectedCreation: null }),

      setSortBy: (sortBy) => {
        set({ sortBy })
        get().applySorting()
      },

      setSortOrder: (sortOrder) => {
        set({ sortOrder })
        get().applySorting()
      },

      setFilterCategory: (category) => set({ filterCategory: category }),

      setViewMode: (viewMode) => set({ viewMode }),

      applySorting: () => set((state) => {
        const sorted = [...state.savedCreations].sort((a, b) => {
          let comparison = 0

          switch (state.sortBy) {
            case 'date':
              comparison = new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime()
              break
            case 'category':
              comparison = a.selectedPose.category.localeCompare(b.selectedPose.category)
              break
            case 'name':
              comparison = a.selectedPose.name.localeCompare(b.selectedPose.name)
              break
          }

          return state.sortOrder === 'asc' ? comparison : -comparison
        })

        return { savedCreations: sorted }
      }),

      getCreationsByCategory: (category) => {
        const { savedCreations } = get()
        return category === 'all'
          ? savedCreations
          : savedCreations.filter(c => c.selectedPose.category === category)
      },

      getCreationsCount: () => {
        const { savedCreations, filterCategory } = get()
        return filterCategory === 'all'
          ? savedCreations.length
          : savedCreations.filter(c => c.selectedPose.category === filterCategory).length
      },

      getLatestCreation: () => {
        const { savedCreations } = get()
        if (savedCreations.length === 0) return null

        return savedCreations.reduce((latest, current) =>
          new Date(current.generatedAt) > new Date(latest.generatedAt) ? current : latest
        )
      },

      getFavoriteCategory: () => {
        const { savedCreations } = get()
        if (savedCreations.length === 0) return 'professional'

        // Count creations by category
        const categoryCounts = savedCreations.reduce((counts, creation) => {
          const category = creation.selectedPose.category
          counts[category] = (counts[category] || 0) + 1
          return counts
        }, {} as Record<string, number>)

        // Find category with most creations
        return Object.keys(categoryCounts).reduce((a, b) =>
          categoryCounts[a] > categoryCounts[b] ? a : b
        )
      }
}))
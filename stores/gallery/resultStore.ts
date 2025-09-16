/**
 * ZUSTAND STORE LIFECYCLE - Result Store
 *
 * STATE PURPOSE: Manages current result viewing, sharing, and interactions
 * WHEN CREATED: User views creation result (new or from gallery)
 * WHERE CREATED: Generation completion, gallery item selection
 *
 * WHEN UPDATED: Result viewing, sharing actions, before/after toggles
 * WHERE UPDATED: ResultPage interactions, sharing BottomSheet
 *
 * STATE EVOLUTION:
 * - INITIALIZE: No result currently viewed
 * - READ: Display result, show sharing options, before/after state
 * - UPDATE: Set new result, toggle modes, share actions
 * - PERSIST: Current viewing state (session-only)
 * - RESET: Navigate away from result screen
 *
 * RELATIONSHIPS:
 * - Receives results from generationStore (new) or galleryStore (existing)
 * - Triggers navigationStore for sharing BottomSheet
 * - Uses subscriptionStore for watermark/premium features
 * SIDE EFFECTS: Share actions, navigation triggers, social media integrations
 */

import { create } from 'zustand'
import { Creation, ShareOptions } from '@/types/dream'

interface ResultState {
  // Current result
  viewingResult: Creation | null
  resultSource: 'generation' | 'gallery' // How we got to this result

  // Viewing modes
  showBeforeAfter: boolean
  currentView: 'before' | 'after' | 'split'

  // Sharing
  shareOptions: ShareOptions
  isSaving: boolean
  isSharing: boolean

  // Actions
  setViewingResult: (result: Creation, source: 'generation' | 'gallery') => void
  clearViewingResult: () => void

  // View modes
  toggleBeforeAfter: () => void
  setCurrentView: (view: ResultState['currentView']) => void

  // Sharing and saving
  saveToGallery: () => Promise<void>
  saveToPhotos: () => Promise<void>
  shareResult: (platform: ShareOptions['platform']) => Promise<void>
  updateShareOptions: (options: Partial<ShareOptions>) => void

  // Helpers
  canSaveToGallery: () => boolean
  isResultSaved: () => boolean
  getShareUrl: (platform: string) => string
}

export const useResultStore = create<ResultState>((set, get) => ({
  viewingResult: null,
  resultSource: 'generation',

  showBeforeAfter: false,
  currentView: 'after',

  shareOptions: {
    platform: 'instagram',
    includeBeforeAfter: false,
    addWatermark: false
  },

  isSaving: false,
  isSharing: false,

  setViewingResult: (result, source) => set({
    viewingResult: result,
    resultSource: source,
    showBeforeAfter: false,
    currentView: 'after'
  }),

  clearViewingResult: () => set({
    viewingResult: null,
    resultSource: 'generation',
    showBeforeAfter: false,
    currentView: 'after',
    isSaving: false,
    isSharing: false
  }),

  toggleBeforeAfter: () => set((state) => ({
    showBeforeAfter: !state.showBeforeAfter,
    currentView: !state.showBeforeAfter ? 'split' : 'after'
  })),

  setCurrentView: (currentView) => set({ currentView }),

  saveToGallery: async () => {
    const { viewingResult } = get()
    if (!viewingResult || !get().canSaveToGallery()) return

    set({ isSaving: true })

    try {
      // Simulate save process
      await new Promise(resolve => setTimeout(resolve, 1000))

      // In real app, this would save to gallery store
      // For now, just simulate success

      set({ isSaving: false })
    } catch (error) {
      set({ isSaving: false })
      throw error
    }
  },

  saveToPhotos: async () => {
    const { viewingResult } = get()
    if (!viewingResult) return

    set({ isSaving: true })

    try {
      // Simulate save to device photos
      await new Promise(resolve => setTimeout(resolve, 1500))

      // In real app, this would use expo-media-library
      console.log('Saved to photos:', viewingResult.resultImage)

      set({ isSaving: false })
    } catch (error) {
      set({ isSaving: false })
      throw error
    }
  },

  shareResult: async (platform) => {
    const { viewingResult, shareOptions } = get()
    if (!viewingResult) return

    set({ isSharing: true, shareOptions: { ...shareOptions, platform } })

    try {
      // Simulate sharing process
      await new Promise(resolve => setTimeout(resolve, 1000))

      const shareUrl = get().getShareUrl(platform)
      console.log(`Sharing to ${platform}:`, shareUrl)

      // In real app, this would use expo-sharing or platform-specific SDKs

      set({ isSharing: false })
    } catch (error) {
      set({ isSharing: false })
      throw error
    }
  },

  updateShareOptions: (options) => set((state) => ({
    shareOptions: { ...state.shareOptions, ...options }
  })),

  canSaveToGallery: () => {
    const { viewingResult, resultSource } = get()
    return viewingResult !== null && resultSource === 'generation'
  },

  isResultSaved: () => {
    const { resultSource } = get()
    return resultSource === 'gallery'
  },

  getShareUrl: (platform) => {
    const { viewingResult } = get()
    if (!viewingResult) return ''

    // Mock share URL generation
    const baseUrl = 'https://dreampie.app/shared'
    return `${baseUrl}/${viewingResult.id}?platform=${platform}`
  }
}))
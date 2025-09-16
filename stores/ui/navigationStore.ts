/**
 * ZUSTAND STORE LIFECYCLE - Navigation Store
 *
 * STATE PURPOSE: Manages BottomSheet states, modal visibility, and navigation flow
 * WHEN CREATED: App initialization, first navigation action
 * WHERE CREATED: App root, navigation actions from any component
 *
 * WHEN UPDATED: Modal open/close actions, navigation flow changes
 * WHERE UPDATED: BottomSheet components, page transitions, user interactions
 *
 * STATE EVOLUTION:
 * - INITIALIZE: All BottomSheets closed, no active flow
 * - READ: Components check modal visibility, current flow state
 * - UPDATE: Open/close modals, track navigation flow
 * - PERSIST: Navigation history (optional)
 * - RESET: Close all modals on app restart
 *
 * RELATIONSHIPS:
 * - Connects to all PAGE components that trigger modals
 * - Coordinates with creation/gallery stores for flow management
 * SIDE EFFECTS: Modal visibility changes, navigation flow updates
 */

import { create } from 'zustand'

export interface NavigationState {
  // BottomSheet states
  bottomSheets: {
    settings: { isOpen: boolean; snapIndex: number }
    poseLibrary: { isOpen: boolean; snapIndex: number }
    selfieGuide: { isOpen: boolean; snapIndex: number }
    paywall: { isOpen: boolean; snapIndex: number }
    shareOptions: { isOpen: boolean; snapIndex: number }
  }

  // Navigation flow state
  currentFlow: 'onboarding' | 'creation' | 'gallery' | 'settings'
  navigationHistory: string[]

  // Actions
  openBottomSheet: (sheet: keyof NavigationState['bottomSheets'], snapIndex?: number) => void
  closeBottomSheet: (sheet: keyof NavigationState['bottomSheets']) => void
  closeAllBottomSheets: () => void
  setCurrentFlow: (flow: NavigationState['currentFlow']) => void
  pushToHistory: (route: string) => void
  goBack: () => string | undefined
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  bottomSheets: {
    settings: { isOpen: false, snapIndex: 1 },
    poseLibrary: { isOpen: false, snapIndex: 1 },
    selfieGuide: { isOpen: false, snapIndex: 1 },
    paywall: { isOpen: false, snapIndex: 1 },
    shareOptions: { isOpen: false, snapIndex: 0 },
  },

  currentFlow: 'creation',
  navigationHistory: [],

  openBottomSheet: (sheet, snapIndex = 1) => set((state) => ({
    bottomSheets: {
      ...state.bottomSheets,
      [sheet]: { isOpen: true, snapIndex }
    }
  })),

  closeBottomSheet: (sheet) => set((state) => ({
    bottomSheets: {
      ...state.bottomSheets,
      [sheet]: { ...state.bottomSheets[sheet], isOpen: false }
    }
  })),

  closeAllBottomSheets: () => set((state) => {
    const closedBottomSheets = { ...state.bottomSheets }
    Object.keys(closedBottomSheets).forEach(key => {
      closedBottomSheets[key as keyof typeof closedBottomSheets].isOpen = false
    })
    return { bottomSheets: closedBottomSheets }
  }),

  setCurrentFlow: (flow) => set({ currentFlow: flow }),

  pushToHistory: (route) => set((state) => ({
    navigationHistory: [...state.navigationHistory, route]
  })),

  goBack: () => {
    const { navigationHistory } = get()
    if (navigationHistory.length === 0) return undefined

    const previousRoute = navigationHistory[navigationHistory.length - 1]
    set((state) => ({
      navigationHistory: state.navigationHistory.slice(0, -1)
    }))

    return previousRoute
  }
}))
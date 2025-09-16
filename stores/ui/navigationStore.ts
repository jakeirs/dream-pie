/**
 * ZUSTAND STORE LIFECYCLE - Navigation Store (Simplified)
 *
 * STATE PURPOSE: Manages navigation flow state and history tracking
 * WHEN CREATED: App initialization, navigation actions
 * WHERE CREATED: App root, navigation actions from components
 *
 * WHEN UPDATED: Navigation flow changes, route history updates
 * WHERE UPDATED: Page transitions, user navigation actions
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Creation flow, empty history
 * - READ: Components check current flow, navigation state
 * - UPDATE: Track navigation flow, manage history
 * - PERSIST: Navigation history for back navigation
 * - RESET: Flow resets on app restart
 *
 * RELATIONSHIPS:
 * - Coordinates with creation/gallery stores for flow management
 * - Settings state tracking for focus mode
 * SIDE EFFECTS: Navigation flow updates, history management
 */

import { create } from 'zustand'

export interface NavigationState {
  // Navigation flow state
  currentFlow: 'onboarding' | 'creation' | 'gallery' | 'settings'
  navigationHistory: string[]
  isSettingsOpen: boolean

  // Actions
  setCurrentFlow: (flow: NavigationState['currentFlow']) => void
  pushToHistory: (route: string) => void
  goBack: () => string | undefined
  openSettings: () => void
  closeSettings: () => void
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentFlow: 'creation',
  navigationHistory: [],
  isSettingsOpen: false,

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
  },

  openSettings: () => set({ isSettingsOpen: true }),
  closeSettings: () => set({ isSettingsOpen: false })
}))
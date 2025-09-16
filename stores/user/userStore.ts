/**
 * ZUSTAND STORE LIFECYCLE - User Store
 *
 * STATE PURPOSE: Manages user authentication, profile, and app preferences
 * WHEN CREATED: App launch, authentication check
 * WHERE CREATED: App initialization, login/registration flows
 *
 * WHEN UPDATED: Login/logout, profile edits, preference changes
 * WHERE UPDATED: Auth components, settings, onboarding flow
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Check for existing user session
 * - READ: Display user info, check auth status
 * - UPDATE: Login/logout, profile updates, preferences
 * - PERSIST: User data, auth tokens, preferences
 * - RESET: Logout, app uninstall
 *
 * RELATIONSHIPS:
 * - Connected to subscriptionStore for premium features
 * - Used by all components requiring user context
 * SIDE EFFECTS: Auth state changes, preference applications
 */

import { create } from 'zustand'
import { DreamPieUser, OnboardingStep } from '@/types/dream'
import { mockDreamPieUser } from '@/mockData/dream'

interface UserState {
  user: DreamPieUser | null
  isAuthenticated: boolean
  isLoading: boolean

  // Actions
  setUser: (user: DreamPieUser) => void
  updateUser: (updates: Partial<DreamPieUser>) => void
  logout: () => void
  setLoading: (loading: boolean) => void

  // Onboarding actions
  completeOnboardingStep: (step: OnboardingStep) => void
  setOnboardingStep: (step: OnboardingStep) => void
  completeOnboarding: () => void

  // Preference actions
  updatePreferences: (preferences: Partial<DreamPieUser['preferences']>) => void
}

export const useUserStore = create<UserState>((set, get) => ({
  user: mockDreamPieUser as DreamPieUser, // Start with mock user for development
  isAuthenticated: true, // Mock authenticated state
  isLoading: false,

  setUser: (user) => set({
    user,
    isAuthenticated: true,
    isLoading: false
  }),

  updateUser: (updates) => set((state) => ({
    user: state.user ? { ...state.user, ...updates } : null
  })),

  logout: () => set({
    user: null,
    isAuthenticated: false,
    isLoading: false
  }),

  setLoading: (loading) => set({ isLoading: loading }),

  completeOnboardingStep: (step) => set((state) => {
    if (!state.user) return state

    const completedSteps = [...state.user.onboarding.completedSteps]
    if (!completedSteps.includes(step)) {
      completedSteps.push(step)
    }

    return {
      user: {
        ...state.user,
        onboarding: {
          ...state.user.onboarding,
          completedSteps
        }
      }
    }
  }),

  setOnboardingStep: (step) => set((state) => {
    if (!state.user) return state

    return {
      user: {
        ...state.user,
        onboarding: {
          ...state.user.onboarding,
          currentStep: step
        }
      }
    }
  }),

  completeOnboarding: () => set((state) => {
    if (!state.user) return state

    return {
      user: {
        ...state.user,
        onboarding: {
          ...state.user.onboarding,
          completed: true,
          completedAt: new Date().toISOString()
        }
      }
    }
  }),

  updatePreferences: (preferences) => set((state) => {
    if (!state.user) return state

    return {
      user: {
        ...state.user,
        preferences: {
          ...state.user.preferences,
          ...preferences
        }
      }
    }
  })
}))
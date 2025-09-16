/**
 * ZUSTAND STORE LIFECYCLE - Onboarding Store
 *
 * STATE PURPOSE: Manages user onboarding flow, step tracking, and completion
 * WHEN CREATED: New user first app launch, onboarding flow start
 * WHERE CREATED: App initialization, onboarding screens
 *
 * WHEN UPDATED: Step progression, completion status, skip actions
 * WHERE UPDATED: Onboarding components, step navigation
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Check if onboarding needed, set initial step
 * - READ: Display current step, check completion status
 * - UPDATE: Progress through steps, mark completion
 * - PERSIST: Onboarding completion status, progress
 * - RESET: App reinstall, account reset (rare)
 *
 * RELATIONSHIPS:
 * - Connected to userStore for onboarding status
 * - Triggers navigationStore for flow control
 * - May trigger subscriptionStore introduction
 * SIDE EFFECTS: Navigation flow changes, user preference updates
 */

import { create } from 'zustand'
import { OnboardingStep } from '@/types/dream'

interface OnboardingState {
  // Onboarding flow
  isOnboardingComplete: boolean
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  skippedSteps: OnboardingStep[]

  // Flow control
  canSkipStep: (step: OnboardingStep) => boolean
  isStepRequired: (step: OnboardingStep) => boolean

  // Actions
  startOnboarding: () => void
  nextStep: () => void
  previousStep: () => void
  skipStep: (step: OnboardingStep) => void
  completeStep: (step: OnboardingStep) => void
  completeOnboarding: () => void
  resetOnboarding: () => void

  // Navigation helpers
  goToStep: (step: OnboardingStep) => void
  getStepIndex: (step: OnboardingStep) => number
  getTotalSteps: () => number
  getProgressPercentage: () => number
}

const ONBOARDING_STEPS: OnboardingStep[] = [
  'welcome',
  'camera-permission',
  'first-pose-selection',
  'first-generation',
  'save-and-share',
  'subscription-intro'
]

const REQUIRED_STEPS: OnboardingStep[] = [
  'welcome',
  'camera-permission'
]

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
      isOnboardingComplete: false,
      currentStep: 'welcome',
      completedSteps: [],
      skippedSteps: [],

      canSkipStep: (step) => !REQUIRED_STEPS.includes(step),

      isStepRequired: (step) => REQUIRED_STEPS.includes(step),

      startOnboarding: () => set({
        isOnboardingComplete: false,
        currentStep: 'welcome',
        completedSteps: [],
        skippedSteps: []
      }),

      nextStep: () => set((state) => {
        const currentIndex = get().getStepIndex(state.currentStep)
        const nextIndex = Math.min(currentIndex + 1, ONBOARDING_STEPS.length - 1)

        if (nextIndex === ONBOARDING_STEPS.length - 1 &&
            !state.completedSteps.includes(ONBOARDING_STEPS[nextIndex])) {
          // If we're on the last step and haven't completed it, complete onboarding
          return {
            currentStep: ONBOARDING_STEPS[nextIndex],
            isOnboardingComplete: true
          }
        }

        return { currentStep: ONBOARDING_STEPS[nextIndex] }
      }),

      previousStep: () => set((state) => {
        const currentIndex = get().getStepIndex(state.currentStep)
        const previousIndex = Math.max(currentIndex - 1, 0)
        return { currentStep: ONBOARDING_STEPS[previousIndex] }
      }),

      skipStep: (step) => set((state) => {
        if (!get().canSkipStep(step)) return state

        const skippedSteps = [...state.skippedSteps]
        if (!skippedSteps.includes(step)) {
          skippedSteps.push(step)
        }

        // Move to next step
        get().nextStep()

        return { skippedSteps }
      }),

      completeStep: (step) => set((state) => {
        const completedSteps = [...state.completedSteps]
        if (!completedSteps.includes(step)) {
          completedSteps.push(step)
        }

        // Check if this was the last step
        const allRequiredCompleted = REQUIRED_STEPS.every(reqStep =>
          completedSteps.includes(reqStep)
        )
        const currentIndex = get().getStepIndex(step)
        const isLastStep = currentIndex === ONBOARDING_STEPS.length - 1

        if (isLastStep && allRequiredCompleted) {
          return {
            completedSteps,
            isOnboardingComplete: true
          }
        }

        return { completedSteps }
      }),

      completeOnboarding: () => set({
        isOnboardingComplete: true,
        completedSteps: [...REQUIRED_STEPS] // At minimum, required steps must be completed
      }),

      resetOnboarding: () => set({
        isOnboardingComplete: false,
        currentStep: 'welcome',
        completedSteps: [],
        skippedSteps: []
      }),

      goToStep: (step) => set({ currentStep: step }),

      getStepIndex: (step) => ONBOARDING_STEPS.indexOf(step),

      getTotalSteps: () => ONBOARDING_STEPS.length,

      getProgressPercentage: () => {
        const { currentStep, completedSteps } = get()
        const currentIndex = get().getStepIndex(currentStep)
        const completedCount = completedSteps.length
        const totalSteps = ONBOARDING_STEPS.length

        // Progress is based on completed steps plus current step progress
        return Math.min(((completedCount + (currentIndex + 1)) / totalSteps) * 100, 100)
      }
}))
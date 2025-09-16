/**
 * ZUSTAND STORE LIFECYCLE - Subscription Store
 *
 * STATE PURPOSE: Manages user subscription status, credits, and premium features
 * WHEN CREATED: User login, subscription status check
 * WHERE CREATED: App initialization, subscription components
 *
 * WHEN UPDATED: Credit usage, subscription changes, feature access checks
 * WHERE UPDATED: Creation flow, paywall interactions, subscription management
 *
 * STATE EVOLUTION:
 * - INITIALIZE: Load user's current subscription status
 * - READ: Check feature access, display credits, show tier
 * - UPDATE: Use credits, upgrade/downgrade tier, refresh status
 * - PERSIST: Subscription data, credit counts
 * - RESET: Subscription expiry, account changes
 *
 * RELATIONSHIPS:
 * - Connected to userStore for subscription data
 * - Used by creation flow for credit gating
 * - Triggers paywall when limits reached
 * SIDE EFFECTS: Feature access changes, paywall triggers, credit updates
 */

import { create } from 'zustand'
import { SubscriptionTier, UserSubscription, SubscriptionPlan } from '@/types/dream'
import { mockSubscriptionPlans } from '@/mockData/dream'

interface SubscriptionState {
  subscription: UserSubscription
  availablePlans: SubscriptionPlan[]

  // Actions
  useCredit: () => boolean // Returns true if credit was available and used
  addCredits: (amount: number) => void
  upgradeTier: (tier: SubscriptionTier) => void
  checkSubscriptionStatus: () => void

  // Feature checks
  canCreateMore: () => boolean
  canAccessPremiumPoses: () => boolean
  canSaveWithoutWatermark: () => boolean
  hasUnlimitedSaves: () => boolean

  // Credit management
  getRemainingCredits: () => number
  getCreditsUsedThisMonth: () => number
}

const getDefaultSubscription = (): UserSubscription => ({
  tier: 'free',
  status: 'active',
  creditsRemaining: 2,
  creditsTotal: 3,
  features: mockSubscriptionPlans[0].features
})

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  subscription: getDefaultSubscription(),
  availablePlans: mockSubscriptionPlans,

      useCredit: () => {
        const { subscription } = get()
        if (subscription.creditsRemaining <= 0) {
          return false // No credits available
        }

        set((state) => ({
          subscription: {
            ...state.subscription,
            creditsRemaining: state.subscription.creditsRemaining - 1
          }
        }))

        return true // Credit successfully used
      },

      addCredits: (amount) => set((state) => ({
        subscription: {
          ...state.subscription,
          creditsRemaining: state.subscription.creditsRemaining + amount
        }
      })),

      upgradeTier: (tier) => {
        const plan = mockSubscriptionPlans.find(p => p.tier === tier)
        if (!plan) return

        set((state) => ({
          subscription: {
            ...state.subscription,
            tier,
            features: plan.features,
            creditsTotal: plan.features.maxCreationsPerMonth,
            creditsRemaining: plan.features.maxCreationsPerMonth,
            renewsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
          }
        }))
      },

      checkSubscriptionStatus: () => {
        const { subscription } = get()

        // Check if subscription has expired
        if (subscription.renewsAt && new Date(subscription.renewsAt) < new Date()) {
          set((state) => ({
            subscription: {
              ...state.subscription,
              status: 'expired'
            }
          }))
        }
      },

      // Feature checks
      canCreateMore: () => {
        const { subscription } = get()
        return subscription.creditsRemaining > 0 || subscription.tier !== 'free'
      },

      canAccessPremiumPoses: () => {
        const { subscription } = get()
        return subscription.features.premiumPoses
      },

      canSaveWithoutWatermark: () => {
        const { subscription } = get()
        return subscription.features.watermarkFree
      },

      hasUnlimitedSaves: () => {
        const { subscription } = get()
        return subscription.features.unlimitedSaves
      },

      getRemainingCredits: () => {
        const { subscription } = get()
        return subscription.creditsRemaining
      },

      getCreditsUsedThisMonth: () => {
        const { subscription } = get()
        return subscription.creditsTotal - subscription.creditsRemaining
      }
}))
/**
 * MOCK DATA LIFECYCLE - Dream Pie Subscriptions
 *
 * WHEN CREATED: App initialization, user account setup
 * WHERE CREATED: AuthService.signUp(), subscription components
 *
 * WHEN USED: Paywall display, feature gating, billing information
 * WHERE USED: PaywallPage, SubscriptionCard, feature access checks
 *
 * HOW DATA EVOLVES:
 * - CREATE: New user gets free tier, upgrades create pro/premium
 * - READ: Feature access checks, paywall display, billing info
 * - UPDATE: Tier upgrades, credit usage, renewal status
 * - DELETE: Account cancellation, downgrades
 *
 * RELATIONSHIPS:
 * - Users: subscription.tier -> user.subscription (one-to-one)
 * - Poses: subscription.features.premiumPoses -> poses.isPremium (access control)
 * - Creations: subscription.creditsRemaining -> creation limits
 */

import { UserSubscription, SubscriptionPlan } from '@/types/dream'

export const mockSubscriptions: UserSubscription[] = [
  {
    tier: 'free',
    status: 'active',
    creditsRemaining: 2,
    creditsTotal: 5,
    creditsUsed: 3,
    features: {
      maxCreationsPerMonth: 5,
      unlimitedSaves: false,
      watermarkFree: false,
      premiumPoses: false,
      priorityProcessing: false,
      advancedEditing: false,
    },
  },
  {
    tier: 'pro',
    status: 'active',
    creditsRemaining: 85,
    creditsTotal: 100,
    creditsUsed: 15,
    renewsAt: '2024-02-15T00:00:00Z',
    features: {
      maxCreationsPerMonth: 100,
      unlimitedSaves: true,
      watermarkFree: true,
      premiumPoses: true,
      priorityProcessing: false,
      advancedEditing: true,
    },
  },
]

export const mockSubscriptionPlans: SubscriptionPlan[] = [
  {
    tier: 'free',
    name: 'Free',
    description: 'Perfect for trying out Dream Pie',
    price: {
      monthly: 0,
      yearly: 0,
    },
    features: {
      maxCreationsPerMonth: 5,
      unlimitedSaves: false,
      watermarkFree: false,
      premiumPoses: false,
      priorityProcessing: false,
      advancedEditing: false,
    },
  },
  {
    tier: 'pro',
    name: 'Pro',
    description: 'Everything you need for professional results',
    price: {
      monthly: 9.99,
      yearly: 99.99,
    },
    features: {
      maxCreationsPerMonth: 100,
      unlimitedSaves: true,
      watermarkFree: true,
      premiumPoses: true,
      priorityProcessing: false,
      advancedEditing: true,
    },
    popularBadge: true,
  },
  {
    tier: 'premium',
    name: 'Premium',
    description: 'Unlimited everything with priority support',
    price: {
      monthly: 19.99,
      yearly: 199.99,
    },
    features: {
      maxCreationsPerMonth: 999,
      unlimitedSaves: true,
      watermarkFree: true,
      premiumPoses: true,
      priorityProcessing: true,
      advancedEditing: true,
    },
  },
]

export const getSubscriptionByTier = (tier: 'free' | 'pro' | 'premium') => {
  return mockSubscriptions.find(sub => sub.tier === tier)
}

export const getPlanByTier = (tier: 'free' | 'pro' | 'premium') => {
  return mockSubscriptionPlans.find(plan => plan.tier === tier)
}
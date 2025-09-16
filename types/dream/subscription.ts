/**
 * DREAM PIE TYPES - Subscriptions
 *
 * Defines the structure for user subscription and premium features
 * Used for paywall, feature gating, and billing
 */

export interface UserSubscription {
  tier: SubscriptionTier
  status: SubscriptionStatus
  creditsRemaining: number
  creditsTotal: number
  creditsUsed: number
  renewsAt?: string
  canceledAt?: string
  features: SubscriptionFeatures
}

export type SubscriptionTier = 'free' | 'pro' | 'premium'

export type SubscriptionStatus =
  | 'active'
  | 'expired'
  | 'canceled'
  | 'trial'

export interface SubscriptionFeatures {
  maxCreationsPerMonth: number
  unlimitedSaves: boolean
  watermarkFree: boolean
  premiumPoses: boolean
  priorityProcessing: boolean
  advancedEditing: boolean
}

export interface SubscriptionPlan {
  tier: SubscriptionTier
  name: string
  description: string
  price: {
    monthly: number
    yearly: number
  }
  features: SubscriptionFeatures
  popularBadge?: boolean
  trialDays?: number
}

export interface BillingInfo {
  nextBillingDate: string
  amount: number
  currency: string
  paymentMethod: string
}
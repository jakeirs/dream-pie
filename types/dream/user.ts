/**
 * DREAM PIE TYPES - User
 *
 * Extends base user types for Dream Pie specific functionality
 * Includes onboarding, preferences, and app-specific user data
 */

import { User } from '@/types/users'
import { UserSubscription } from './subscription'

export interface DreamPieUser extends User {
  subscription: UserSubscription
  preferences: UserPreferences
  onboarding: OnboardingStatus
  stats: UserStats
}

export interface UserPreferences {
  defaultPoseCategory: string
  autoSaveResults: boolean
  shareWithWatermark: boolean
  allowNotifications: boolean
  preferredQuality: 'standard' | 'high' | 'ultra'
}

export interface OnboardingStatus {
  completed: boolean
  currentStep: OnboardingStep
  completedSteps: OnboardingStep[]
  startedAt: string
  completedAt?: string
}

export type OnboardingStep =
  | 'welcome'
  | 'camera-permission'
  | 'first-pose-selection'
  | 'first-generation'
  | 'save-and-share'
  | 'subscription-intro'

export interface UserStats {
  totalGenerations: number
  favoriteCategory: string
  joinedAt: string
  lastActiveAt: string
  creationsThisMonth: number
}
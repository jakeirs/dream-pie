/**
 * Central App Stores Hook
 *
 * Provides unified access to all Zustand stores following the same
 * organizational pattern as mockData exports.
 *
 * This hook enables:
 * - Single import for all store access
 * - Type-safe store coordination
 * - Centralized store relationship management
 * - Easy cross-store communication
 */

// User domain stores
import { useUserStore } from './user/userStore'
import { useSubscriptionStore } from './user/subscriptionStore'

// Creation domain stores
import { usePoseStore } from './creation/poseStore'
import { usePhotoStore } from './creation/photoStore'
import { useGenerationStore } from './creation/generationStore'

// Gallery domain stores
import { useGalleryStore } from './gallery/galleryStore'
import { useResultStore } from './gallery/resultStore'

// UI domain stores
import { useNavigationStore } from './ui/navigationStore'
import { useOnboardingStore } from './ui/onboardingStore'

/**
 * Central hook for accessing all application stores
 *
 * Usage:
 * ```tsx
 * const { user, pose, generation, navigation } = useAppStores()
 *
 * // Access any store method or state
 * const handleCreatePhoto = () => {
 *   if (!subscription.canCreateMore()) {
 *     navigation.openBottomSheet('paywall')
 *     return
 *   }
 *
 *   generation.startGeneration(
 *     pose.selectedPose!.id,
 *     pose.selectedPose!.name,
 *     pose.selectedPose!.category,
 *     photo.selectedPhoto!
 *   )
 * }
 * ```
 */
export const useAppStores = () => {
  // User domain
  const user = useUserStore()
  const subscription = useSubscriptionStore()

  // Creation domain
  const pose = usePoseStore()
  const photo = usePhotoStore()
  const generation = useGenerationStore()

  // Gallery domain
  const gallery = useGalleryStore()
  const result = useResultStore()

  // UI domain
  const navigation = useNavigationStore()
  const onboarding = useOnboardingStore()

  return {
    // User domain
    user,
    subscription,

    // Creation domain
    pose,
    photo,
    generation,

    // Gallery domain
    gallery,
    result,

    // UI domain
    navigation,
    onboarding,

    // Composite actions (cross-store coordination)
    actions: {
      /**
       * Complete creation flow - coordinates multiple stores
       */
      completeCreation: async () => {
        const currentResult = generation.currentResult
        if (!currentResult) return

        // Save to gallery
        gallery.saveCreation(currentResult)

        // Set for result viewing
        result.setViewingResult(currentResult, 'generation')

        // Reset creation state
        generation.resetGeneration()
        pose.clearSelectedPose()
        photo.clearPhoto()
      },

      /**
       * Start new creation - resets creation flow
       */
      startNewCreation: () => {
        generation.resetGeneration()
        pose.clearSelectedPose()
        photo.clearPhoto()
        result.clearViewingResult()
        navigation.closeAllBottomSheets()
      },

      /**
       * View gallery item - coordinates gallery and result stores
       */
      viewGalleryItem: (creation: any) => {
        gallery.selectCreation(creation)
        result.setViewingResult(creation, 'gallery')
      },

      /**
       * Handle subscription upgrade - updates user and closes paywall
       */
      handleSubscriptionUpgrade: (tier: 'pro' | 'premium') => {
        subscription.upgradeTier(tier)
        navigation.closeBottomSheet('paywall')

        // Update user store subscription data
        if (user.user) {
          user.updateUser({
            subscription: subscription.subscription
          })
        }
      },

      /**
       * Complete onboarding step - updates both stores
       */
      completeOnboardingStep: (step: any) => {
        onboarding.completeStep(step)

        if (user.user) {
          user.completeOnboardingStep(step)
        }
      }
    }
  }
}
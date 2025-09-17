// Store Combiner - Main entry point for all Zustand stores
import { useNavigationStore } from './navigationStore'

/**
 * Main hook to access all application stores
 *
 * Usage:
 * const { navigation } = useAppStores()
 * navigation.openPoseLibrary()
 */
export const useAppStores = () => ({
  navigation: useNavigationStore(),
})

// Export individual stores for direct access if needed
export { useNavigationStore } from './navigationStore'
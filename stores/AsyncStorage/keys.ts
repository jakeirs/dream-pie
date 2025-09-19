/**
 * ASYNCSTORAGE KEYS - Centralized key management for persistent storage
 *
 * This file centralizes all AsyncStorage keys used throughout the Dream Pie app.
 * Each key includes documentation about its purpose, usage location, and data structure.
 *
 * BENEFITS:
 * - Prevents key name collisions
 * - Makes refactoring easier
 * - Documents all persistent data in one place
 * - Provides TypeScript safety for key names
 */

/**
 * USER_SELFIES - Stores user-captured selfie photos
 *
 * WHERE USED:
 * - components/ui/CameraButton/hooks/useCameraButton.ts (SAVE: when user captures/selects photo)
 * - components/PAGE/selfie-chooser-bottomsheet/components/SelfieGrid.tsx (READ: load user selfies on mount)
 * - components/PAGE/selfie-chooser-bottomsheet/components/hooks/useSelfieHeader.ts (UPDATE/DELETE: when user deletes selfies)
 *
 * WHY ASYNC:
 * - Persists user photos between app sessions
 * - Allows users to keep their captured selfies after app restart
 * - Combines with file system storage (AsyncStorage stores metadata, files stored in document directory)
 *
 * DATA STRUCTURE: Array&lt;Selfie&gt; as JSON string
 * Example: '[{"id":"user_1726759123456","name":"My Photo","description":"User captured photo","imageUrl":"file:///path/to/selfie_1726759123456.jpg","tags":["user-photo"],"createdAt":"2024-09-19T14:12:03.456Z"}]'
 *
 * ACTIONS:
 * - CREATE: Add new selfie when user captures photo via camera/gallery
 * - READ: Load all user selfies to display in selfie chooser grid
 * - UPDATE: Currently not used (selfies are immutable after creation)
 * - DELETE: Remove selfies when user selects and deletes them
 */
export const USER_SELFIES = 'user_selfies' as const

/**
 * All AsyncStorage keys used in the app
 * Add new keys here as they are created
 */
export const ASYNC_STORAGE_KEYS = {
  USER_SELFIES,
} as const

/**
 * Type-safe key access
 */
export type AsyncStorageKey = keyof typeof ASYNC_STORAGE_KEYS
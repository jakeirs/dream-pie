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
 * USER_POSES - Stores user-uploaded pose images for file system consistency
 *
 * WHERE USED:
 * - Future pose upload functionality (when users can add custom poses)
 * - Pose migration utility to convert bundled assets to file URIs
 * - components/PAGE/pose-library-bottomsheet/components/PoseGrid.tsx (READ: load user poses)
 *
 * WHY ASYNC:
 * - Persists user-uploaded pose images between app sessions
 * - Maintains consistency with selfie file storage system
 * - Combines with file system storage (AsyncStorage stores metadata, files stored in document directory)
 *
 * DATA STRUCTURE: Array<Pose> as JSON string
 * Example: '[{"id":"user_pose_1726759123456","name":"My Pose","description":"User uploaded pose","imageUrl":"file:///path/to/pose_1726759123456.jpg","category":"casual","isPremium":false,"tags":["user-upload"],"createdAt":"2024-09-19T14:12:03.456Z"}]'
 *
 * ACTIONS:
 * - CREATE: Add new pose when user uploads custom pose image
 * - READ: Load all user poses to display alongside bundled poses
 * - UPDATE: Modify pose metadata (name, description, tags, category)
 * - DELETE: Remove poses when user deletes them
 */
export const USER_POSES = 'user_poses' as const

/**
 * USER_CREATIONS - Stores AI-generated creation results with file system consistency
 *
 * WHERE USED:
 * - components/PAGE/gallery/hooks/useGallery.ts (READ: load user creations for gallery)
 * - stores/creationStore.ts (CREATE/UPDATE/DELETE: manage creation lifecycle)
 * - components/ui/StatsFiles/StatsFiles.tsx (READ: count creations for statistics)
 *
 * WHY ASYNC:
 * - Persists AI-generated results between app sessions
 * - Maintains consistency with pose/selfie file storage system
 * - Combines with file system storage (AsyncStorage stores metadata, files stored in document directory)
 *
 * DATA STRUCTURE: Array<Creation> as JSON string
 * Example: '[{"id":"creation_1726759123456","usedPose":{"id":"pose_1","name":"Professional"},"usedSelfie":{"id":"selfie_1","name":"My Photo"},"imageUrl":"file:///path/to/creation_1726759123456.jpg","generatedAt":"2024-09-19T14:12:03.456Z"}]'
 *
 * ACTIONS:
 * - CREATE: Add new creation when AI generation completes successfully
 * - READ: Load all user creations to display in gallery
 * - UPDATE: Modify creation metadata (future: favorites, tags, ratings)
 * - DELETE: Remove creations when user deletes them from gallery
 */
export const USER_CREATIONS = 'user_creations' as const

/**
 * All AsyncStorage keys used in the app
 * Add new keys here as they are created
 */
export const ASYNC_STORAGE_KEYS = {
  USER_SELFIES,
  USER_POSES,
  USER_CREATIONS,
} as const

/**
 * Type-safe key access
 */
export type AsyncStorageKey = keyof typeof ASYNC_STORAGE_KEYS
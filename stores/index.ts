/**
 * Zustand Stores - Central Export Hub
 *
 * Following the same organizational pattern as mockData/
 * Provides centralized access to all application stores
 */

// User domain stores
export * from './user'

// Creation domain stores
export * from './creation'

// Gallery domain stores
export * from './gallery'

// UI domain stores
export * from './ui'

// Central hook for accessing all stores
export { useAppStores } from './useAppStores'
/**
 * Dream Pie App Assets
 *
 * Centralized asset management for all images used in the Dream Pie app.
 * This file provides a single source of truth for all static assets,
 * ensuring consistent imports and proper bundling.
 *
 * Usage:
 * import { appAssets } from '@/shared/assets/assets'
 * <Image source={appAssets.poses.dress} />
 */

export const appAssets = {
  // App icons and branding
  icon: require('@/assets/icon.png'),
  adaptiveIcon: require('@/assets/adaptive-icon.png'),
  favicon: require('@/assets/favicon.png'),
  splash: require('@/assets/splash.png'),

  // Gallery images - User generated content examples
  gallery: {
    img: require('@/assets/gallery/img.jpeg'),
    jsonInstruction: require('@/assets/gallery/JSON-instruction.jpeg'),
  },

  // Pose reference images - AI generation templates
  poses: {
    dress: require('@/assets/poses/dress.jpg'),
    fromTop: require('@/assets/poses/From-top.jpg'),
  },

  // User selfie examples - Input photo examples
  selfies: {
    extendPhoto: require('@/assets/selfies/extend-photo.jpeg'),
  },
}

// Type definitions for better TypeScript support
export type AppAssets = typeof appAssets

// Helper type for asset categories
export type AssetCategory = keyof AppAssets

// Helper function to get all assets from a specific category
export const getAssetsByCategory = <T extends AssetCategory>(category: T): AppAssets[T] => {
  return appAssets[category]
}

// Asset validation helper (useful for debugging)
export const validateAsset = (asset: any): boolean => {
  return asset !== null && asset !== undefined
}
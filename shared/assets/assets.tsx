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

  // Standing poses - Full body standing positions
  posesStanding: {
    galleryHandsBack: require('@/assets/poses/poses-stand/pose-stand-inside-gallery-hands-back.jpg'),
    hallLeanWallHappy: require('@/assets/poses/poses-stand/pose-stand-inside-hall-lean-on-wall-happy.jpg'),
    hallOneHandWallHappy: require('@/assets/poses/poses-stand/pose-stand-inside-hall-one-hand-on-wall-happy.jpg'),
    subwayHandsFace: require('@/assets/poses/poses-stand/pose-stand-inside-subway-hands-face.jpg'),
    cityNightHandsPocket: require('@/assets/poses/poses-stand/pose-stand-outisde-city-night-hands-pocket.jpg'),
    outsideSunSmallCity: require('@/assets/poses/poses-stand/pose-stand-outside-sun-small-city.jpg'),
    outsideWallHandGlasses: require('@/assets/poses/poses-stand/pose-stand-outside-wall-hand-glasses.jpg'),
  },

  // Selfie poses - Self-portrait style poses
  posesSelfie: {
    carGoldenDirectGaze: require('@/assets/poses/poses-selfie/pose-selfie-car-golden-h-direct-gaze.jpg'),
    carGoldenHeadSide: require('@/assets/poses/poses-selfie/pose-selfie-car-golden-h-head-side.jpg'),
    insideGoldenBrunetteTop: require('@/assets/poses/poses-selfie/pose-selfie-inside-golden-h-brunette-direct-gaze-direct-from-top.jpg'),
    insideSideLook: require('@/assets/poses/poses-selfie/pose-selfie-inside-side-look.jpg'),
    outsideNatureGoldenLookUp: require('@/assets/poses/poses-selfie/pose-selfie-outside-nature-golden-h-look-up-from-bottom.jpg'),
    outsideRedHeadCloseEyes: require('@/assets/poses/poses-selfie/pose-selfie-outside-red-head-close-eyes.jpg'),
    outsideTriangle: require('@/assets/poses/poses-selfie/pose-selfie-outside-triangle.jpg'),
  },

  // Sitting poses - Seated positions
  posesSitting: {
    bakeryHeadBothHands: require('@/assets/poses/poses-sit/pose-sit-bakery-head-rest-on-both-hands-direct-from-top.jpg'),
    restaurantCokeShoulders: require('@/assets/poses/poses-sit/pose-sit-restaurant-coke-shoulders-on-table-direct.jpg'),
    restaurantNightHeadHand: require('@/assets/poses/poses-sit/pose-sit-restaurant-night-head-rest-on-hand-direct.jpg'),
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
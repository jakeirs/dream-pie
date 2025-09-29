
import { Pose } from '@/types/dream'
import { appAssets } from '@/shared/assets/assets'

// Standing poses - Full body standing positions
export const standingPoses: Pose[] = [
  {
    id: 'standing_gallery_hands_back',
    name: 'Gallery Hands Behind Back',
    description: 'Professional gallery pose hands behind back',
    category: 'standing',
    imageUrl: appAssets.posesStanding.galleryHandsBack,
    tags: ['professional', 'gallery', 'confident', 'hands-back'],
    createdAt: '2024-09-25T18:13:00Z',
  },
  {
    id: 'standing_hall_lean_wall',
    name: 'Hall Lean Wall Happy',
    description: 'Casual hallway lean on wall happy',
    category: 'standing',
    imageUrl: appAssets.posesStanding.hallLeanWallHappy,
    tags: ['casual', 'hallway', 'lean', 'happy', 'wall'],
    createdAt: '2024-09-25T18:02:00Z',
  },
  {
    id: 'standing_hall_one_hand_wall',
    name: 'Hall One Hand Wall',
    description: 'Stylish one hand on wall pose',
    category: 'standing',
    imageUrl: appAssets.posesStanding.hallOneHandWallHappy,
    tags: ['stylish', 'hallway', 'one-hand', 'wall', 'happy'],
    createdAt: '2024-09-25T18:02:00Z',
  },
  {
    id: 'standing_subway_hands_face',
    name: 'Subway Hands Face',
    description: 'Urban subway hands on face pose',
    category: 'standing',
    imageUrl: appAssets.posesStanding.subwayHandsFace,
    tags: ['urban', 'subway', 'hands-face', 'thoughtful'],
    createdAt: '2024-09-25T19:22:00Z',
  },
  {
    id: 'standing_city_night_hands_pocket',
    name: 'City Night Hands Pocket',
    description: 'Cool city night hands in pockets',
    category: 'standing',
    imageUrl: appAssets.posesStanding.cityNightHandsPocket,
    tags: ['cool', 'city', 'night', 'hands-pocket', 'urban'],
    createdAt: '2024-09-26T12:40:00Z',
  },
  {
    id: 'standing_outside_sun_city',
    name: 'Outside Sun Small City',
    description: 'Bright outdoor small city pose',
    category: 'standing',
    imageUrl: appAssets.posesStanding.outsideSunSmallCity,
    tags: ['bright', 'outdoor', 'small-city', 'sunny'],
    createdAt: '2024-09-25T18:03:00Z',
  },
  {
    id: 'standing_wall_hand_glasses',
    name: 'Wall Hand Glasses',
    description: 'Stylish wall pose hand on glasses',
    category: 'standing',
    imageUrl: appAssets.posesStanding.outsideWallHandGlasses,
    tags: ['stylish', 'wall', 'hand-glasses', 'confident'],
    createdAt: '2024-09-26T12:40:00Z',
  },
]

// Selfie poses - Self-portrait style poses
export const selfiePoses: Pose[] = [
  {
    id: 'selfie_car_golden_direct',
    name: 'Car Golden Direct Gaze',
    description: 'Car selfie golden hour direct gaze',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.carGoldenDirectGaze,
    tags: ['car', 'golden-hour', 'direct-gaze', 'warm'],
    createdAt: '2024-09-24T15:43:00Z',
  },
  {
    id: 'selfie_car_golden_head_side',
    name: 'Car Golden Head Side',
    description: 'Car selfie golden hour head side',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.carGoldenHeadSide,
    tags: ['car', 'golden-hour', 'head-side', 'profile'],
    createdAt: '2024-09-24T15:38:00Z',
  },
  {
    id: 'selfie_inside_golden_brunette_top',
    name: 'Inside Golden Brunette Top',
    description: 'Indoor golden hour brunette from top',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.insideGoldenBrunetteTop,
    tags: ['indoor', 'golden-hour', 'brunette', 'from-top'],
    createdAt: '2024-09-24T15:44:00Z',
  },
  {
    id: 'selfie_inside_side_look',
    name: 'Inside Side Look',
    description: 'Indoor portrait with side look',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.insideSideLook,
    tags: ['indoor', 'side-look', 'portrait', 'contemplative'],
    createdAt: '2024-09-24T15:42:00Z',
  },
  {
    id: 'selfie_nature_golden_look_up',
    name: 'Nature Golden Look Up',
    description: 'Outdoor nature golden hour look up',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.outsideNatureGoldenLookUp,
    tags: ['outdoor', 'nature', 'golden-hour', 'look-up'],
    createdAt: '2024-09-24T15:44:00Z',
  },
  {
    id: 'selfie_outside_red_head_eyes_closed',
    name: 'Outside Red Head Eyes Closed',
    description: 'Outdoor red head with closed eyes',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.outsideRedHeadCloseEyes,
    tags: ['outdoor', 'red-head', 'eyes-closed', 'peaceful'],
    createdAt: '2024-09-24T15:39:00Z',
  },
  {
    id: 'selfie_outside_triangle',
    name: 'Outside Triangle',
    description: 'Creative outdoor triangle pose',
    category: 'selfie',
    imageUrl: appAssets.posesSelfie.outsideTriangle,
    tags: ['outdoor', 'triangle', 'creative', 'artistic'],
    createdAt: '2024-09-25T18:02:00Z',
  },
]

// Sitting poses - Seated positions
export const sittingPoses: Pose[] = [
  {
    id: 'sitting_bakery_head_both_hands',
    name: 'Bakery Head Both Hands',
    description: 'Cozy bakery head resting both hands',
    category: 'sitting',
    imageUrl: appAssets.posesSitting.bakeryHeadBothHands,
    tags: ['cozy', 'bakery', 'head-rest', 'both-hands'],
    createdAt: '2024-09-26T12:40:00Z',
  },
  {
    id: 'sitting_restaurant_coke_shoulders',
    name: 'Restaurant Coke Shoulders',
    description: 'Restaurant coke shoulders on table pose',
    category: 'sitting',
    imageUrl: appAssets.posesSitting.restaurantCokeShoulders,
    tags: ['restaurant', 'coke', 'shoulders-table', 'casual'],
    createdAt: '2024-09-25T18:03:00Z',
  },
  {
    id: 'sitting_restaurant_night_head_hand',
    name: 'Restaurant Night Head Hand',
    description: 'Restaurant night head resting on hand',
    category: 'sitting',
    imageUrl: appAssets.posesSitting.restaurantNightHeadHand,
    tags: ['restaurant', 'night', 'head-rest', 'hand'],
    createdAt: '2024-09-26T12:41:00Z',
  },
]

// Combined export of all poses
export const allPoses: Pose[] = [
  ...standingPoses,
  ...selfiePoses,
  ...sittingPoses,
]

// Helper functions for category filtering
export const getPosesByCategory = (category: 'standing' | 'selfie' | 'sitting'): Pose[] => {
  switch (category) {
    case 'standing':
      return standingPoses
    case 'selfie':
      return selfiePoses
    case 'sitting':
      return sittingPoses
    default:
      return []
  }
}

// Get pose by ID
export const getPoseById = (id: string): Pose | undefined => {
  return allPoses.find((pose) => pose.id === id)
}

// Get poses by tag
export const getPosesByTag = (tag: string): Pose[] => {
  return allPoses.filter((pose) => pose.tags.includes(tag))
}

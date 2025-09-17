# Dream Pie - Zustand State Management Documentation

## Overview

Dream Pie uses **Zustand** for state management with a systematic domain-based architecture. Each store handles specific business logic and follows the same structure as our mockData system for consistency and predictability.

## Store Architecture

### 📁 Store Organization

```
stores/
├── index.ts              # Main store combiner and useAppStores hook
├── userStore.ts          # User authentication & profile management
├── subscriptionStore.ts  # Subscription plans, credits, and billing
├── poseStore.ts         # Pose library, selection, and categories
├── photoStore.ts        # Photo upload, processing, and management
├── generationStore.ts   # AI generation process and queue
├── galleryStore.ts      # Created content gallery and organization
├── resultStore.ts       # Generation results display and actions
└── navigationStore.ts   # BottomSheet states and UI navigation
```

### 🔗 Store Integration Pattern

Each store follows the same TypeScript pattern:

- Uses Dream Pie types from `@/types/dream`
- Imports mock data from `@/mockData/dream`
- No persistence middleware (data resets on refresh)
- Actions return void or updated state
- Full type safety with TypeScript

## Screen-by-Screen Usage

### 🎯 Create Screen (`components/PAGE/index/index.tsx`)

**Purpose**: Main creation flow where users select poses, upload photos, and start generation.

**Stores Used**:

- **poseStore** - Pose selection and library browsing
- **photoStore** - Photo upload and selfie management
- **subscriptionStore** - Credit checking and limits
- **navigationStore** - Opening BottomSheets for modals

**Data Flow**:

```typescript
import { useAppStores } from '@/stores'

const CreateScreen = () => {
  const { pose, photo, subscription, navigation } = useAppStores()

  // WHEN: User wants to select a pose
  // WHAT: Opens pose library BottomSheet
  const handlePoseChange = () => {
    navigation.openBottomSheet('poseLibrary') // → poseLibraryStore actions
  }

  // WHEN: User uploads/takes photo
  // WHAT: Processes and stores photo, opens guide
  const handlePhotoChange = () => {
    photo.setPhoto(selectedImage) // → Updates photoStore.selectedPhoto
    navigation.openBottomSheet('selfieGuide')
  }

  // WHEN: User clicks "Create My Photoshoot"
  // WHAT: Validates inputs, checks credits, starts generation
  const handleCreatePhotoshoot = async () => {
    if (!subscription.canCreateMore()) {
      navigation.openBottomSheet('paywall') // → PaywallStore actions
      return
    }

    if (!pose.selectedPose) {
      navigation.openBottomSheet('poseLibrary')
      return
    }

    if (!photo.selectedPhoto) {
      handlePhotoChange()
      return
    }

    // Use credit and navigate to generation
    if (subscription.useCredit()) {
      router.push('/(creation)/generation') // → generationStore.startGeneration()
    }
  }
}
```

**State Dependencies**:

- `pose.selectedPose` - Currently selected pose from library
- `photo.selectedPhoto` - User's uploaded photo
- `subscription.getRemainingCredits()` - Available credits
- `subscription.subscription.tier` - Free/Pro status for Buy Premium button

---

## 🎛️ BottomSheet Control with Zustand

### **Pattern: Ref Registration & Global Control**

The navigation store manages BottomSheet refs globally, allowing any component to control sheets across the app.

**Implementation:**

```typescript
// stores/navigationStore.ts
interface NavigationStore {
  // Bottom Sheet Refs
  poseLibraryRef: RefObject<BottomSheetLib | null> | null
  paywallRef: RefObject<BottomSheetModal | null> | null

  // Ref Registration
  setPoseLibraryRef: (ref: RefObject<BottomSheetLib | null>) => void
  setPaywallRef: (ref: RefObject<BottomSheetModal | null>) => void
}
```

**Hook Usage Pattern:**

```typescript
// components/PAGE/index/hooks/useBottomSheets.ts
export const useBottomSheets = () => {
  const { navigation } = useAppStores()

  // Create local refs
  const poseLibraryRef = useRef<BottomSheetLib>(null)
  const paywallRef = useRef<BottomSheetModal>(null)

  // Register refs with Zustand store on mount ONCE
  useEffect(() => {
    navigation.setPoseLibraryRef(poseLibraryRef)
    navigation.setPaywallRef(paywallRef)
  }, []) // Empty deps - runs once only

  // Control sheets via Zustand refs
  const handlePoseLibraryClose = () => {
    navigation.poseLibraryRef?.current?.close()
  }

  return { poseLibraryRef, handlePoseLibraryClose }
}
```

**Benefits:**

- **Global Control**: Any component can control any BottomSheet
- **Single Source of Truth**: Refs stored centrally in Zustand
- **Type Safety**: Full TypeScript support with proper ref types
- **Clean Architecture**: Hook handles registration, components use actions

---

### 🖼️ Gallery Screen (`components/PAGE/gallery/index.tsx`)

**Purpose**: Display user's created photoshoots, manage favorites, and handle sharing.

**Stores Used**:

- **galleryStore** - Content management and organization
- **userStore** - User preferences and settings
- **navigationStore** - Share options and result viewing

**Data Flow**:

```typescript
const GalleryScreen = () => {
  const { gallery, user, navigation } = useAppStores()

  // WHEN: Screen loads
  // WHAT: Fetch user's gallery content
  useEffect(() => {
    gallery.loadUserGallery(user.user.id) // → Updates gallery.items
  }, [])

  // WHEN: User taps on a creation
  // WHAT: Opens full result view
  const handleCreationTap = (creationId: string) => {
    gallery.setSelectedCreation(creationId) // → Updates gallery.selectedItem
    router.push('/(creation)/result') // → resultStore displays details
  }

  // WHEN: User wants to share
  // WHAT: Opens share options
  const handleShare = (creation: Creation) => {
    gallery.setSelectedCreation(creation.id)
    navigation.openBottomSheet('shareOptions')
  }
}
```

**State Dependencies**:

- `gallery.items` - Array of user's created content
- `gallery.favorites` - Favorited creations
- `gallery.isLoading` - Loading state for UI feedback

---

### 🎨 Pose Library BottomSheet (`components/PAGE/pose-library/index.tsx`)

**Purpose**: Browse and select poses from categorized library.

**Stores Used**:

- **poseStore** - Pose data and selection
- **subscriptionStore** - Premium pose access
- **navigationStore** - BottomSheet state management

**Data Flow**:

```typescript
const PoseLibraryPage = () => {
  const { pose, subscription, navigation } = useAppStores()

  // WHEN: BottomSheet opens
  // WHAT: Load available poses
  useEffect(() => {
    pose.loadPoses() // → Updates pose.poses array
  }, [])

  // WHEN: User selects a pose
  // WHAT: Check premium access, set selection, close modal
  const handlePoseSelect = (selectedPose: Pose) => {
    if (selectedPose.isPremium && !subscription.hasPremiumAccess()) {
      navigation.openBottomSheet('paywall') // → Switch to paywall
      return
    }

    pose.setSelectedPose(selectedPose) // → Updates pose.selectedPose
    navigation.closeBottomSheet('poseLibrary') // → Close current modal
  }

  // WHEN: User filters by category
  // WHAT: Update filtered poses
  const handleCategoryChange = (category: PoseCategory) => {
    pose.setSelectedCategory(category) // → Updates pose.filteredPoses
  }
}
```

**State Dependencies**:

- `pose.poses` - All available poses
- `pose.filteredPoses` - Poses filtered by category
- `pose.selectedCategory` - Current category filter
- `pose.selectedPose` - Currently selected pose

---

### 💳 Paywall BottomSheet (`components/PAGE/paywall/index.tsx`)

**Purpose**: Handle subscription upgrades and payment processing.

**Stores Used**:

- **subscriptionStore** - Plan management and billing
- **userStore** - User account linking
- **navigationStore** - Modal state management

**Data Flow**:

```typescript
const PaywallPage = () => {
  const { subscription, user, navigation } = useAppStores()

  // WHEN: User selects a plan
  // WHAT: Start purchase process
  const handlePlanSelect = async (planId: string) => {
    subscription.setSelectedPlan(planId) // → Updates subscription.selectedPlan
    subscription.setIsProcessing(true) // → Shows loading UI

    try {
      await subscription.purchaseSubscription(planId, user.user.id)
      navigation.closeBottomSheet('paywall') // → Close on success
      // User is now premium, can access premium features
    } catch (error) {
      subscription.setError(error.message) // → Show error state
    } finally {
      subscription.setIsProcessing(false)
    }
  }

  // WHEN: User cancels
  // WHAT: Close paywall, return to previous screen
  const handleCancel = () => {
    navigation.closeBottomSheet('paywall')
  }
}
```

**State Dependencies**:

- `subscription.plans` - Available subscription plans
- `subscription.selectedPlan` - Currently selected plan
- `subscription.isProcessing` - Payment processing state
- `subscription.error` - Error messages

---

### ⚙️ Settings BottomSheet (`components/PAGE/settings/index.tsx`)

**Purpose**: User preferences, account management, and app settings.

**Stores Used**:

- **userStore** - Profile and preferences
- **subscriptionStore** - Subscription management
- **navigationStore** - Modal state

**Data Flow**:

```typescript
const SettingsPage = () => {
  const { user, subscription, navigation } = useAppStores()

  // WHEN: User updates profile
  // WHAT: Save user preferences
  const handleProfileUpdate = (updates: Partial<User>) => {
    user.updateProfile(updates) // → Updates user.user object
  }

  // WHEN: User wants to manage subscription
  // WHAT: Show subscription details
  const handleSubscriptionManage = () => {
    if (subscription.hasPremiumAccess()) {
      // Show cancellation options
      subscription.loadBillingHistory() // → Updates subscription.billingHistory
    } else {
      navigation.openBottomSheet('paywall') // → Upgrade option
    }
  }
}
```

**State Dependencies**:

- `user.user` - Current user profile
- `user.preferences` - App preferences
- `subscription.subscription` - Current subscription details

---

### 🎬 Generation Screen (`app/(creation)/generation.tsx`)

**Purpose**: AI photo generation process with progress tracking.

**Stores Used**:

- **generationStore** - Generation process management
- **poseStore** - Selected pose data
- **photoStore** - Selected photo data
- **resultStore** - Result handling

**Data Flow**:

```typescript
const GenerationScreen = () => {
  const { generation, pose, photo, result } = useAppStores()

  // WHEN: Screen loads
  // WHAT: Start AI generation process
  useEffect(() => {
    if (pose.selectedPose && photo.selectedPhoto) {
      generation.startGeneration({
        poseId: pose.selectedPose.id,
        photoUrl: photo.selectedPhoto,
        userId: user.user.id,
      }) // → Updates generation.status, generation.progress
    }
  }, [])

  // WHEN: Generation completes
  // WHAT: Navigate to results
  useEffect(() => {
    if (generation.status === 'completed' && generation.result) {
      result.setCurrentResult(generation.result) // → Prepare result display
      router.replace('/(creation)/result')
    }
  }, [generation.status])
}
```

**State Dependencies**:

- `generation.status` - 'idle' | 'processing' | 'completed' | 'error'
- `generation.progress` - 0-100 progress percentage
- `generation.result` - Generated creation result
- `generation.error` - Error messages

---

### 📸 Result Screen (`app/(creation)/result.tsx`)

**Purpose**: Display generated results with sharing and saving options.

**Stores Used**:

- **resultStore** - Result display and actions
- **galleryStore** - Saving to user gallery
- **navigationStore** - Share options

**Data Flow**:

```typescript
const ResultScreen = () => {
  const { result, gallery, navigation } = useAppStores()

  // WHEN: User wants to save to gallery
  // WHAT: Add to user's gallery
  const handleSaveToGallery = async () => {
    if (result.currentResult) {
      await gallery.addToGallery(result.currentResult) // → Updates gallery.items
      result.setIsSaved(true) // → Update UI state
    }
  }

  // WHEN: User wants to share
  // WHAT: Open share options
  const handleShare = () => {
    navigation.openBottomSheet('shareOptions') // → Share modal
  }

  // WHEN: User wants to create another
  // WHAT: Reset stores and return to create
  const handleCreateAnother = () => {
    result.clearCurrentResult() // → Clear result state
    generation.reset() // → Reset generation state
    router.push('/(tabs)/') // → Back to create screen
  }
}
```

**State Dependencies**:

- `result.currentResult` - Currently displayed result
- `result.isSaved` - Whether saved to gallery
- `result.shareUrl` - Shareable URL if available

---

## 🔄 Data Flow Patterns

### Typical User Journey Flow

1. **App Launch**: `userStore` loads user profile, `subscriptionStore` checks subscription status
2. **Create Screen**: User interacts with `poseStore` and `photoStore` for selections
3. **Paywall Trigger**: `subscriptionStore` checks limits, `navigationStore` opens paywall if needed
4. **Generation**: `generationStore` processes AI generation with selected inputs
5. **Results**: `resultStore` displays results, `galleryStore` handles saving
6. **Gallery**: `galleryStore` manages user's created content

### Store Communication Pattern

```typescript
// Stores don't directly communicate - they use shared state and actions

// ❌ DON'T: Store-to-store communication
poseStore.updateSubscriptionAfterSelect()

// ✅ DO: Component orchestrates multiple stores
const handlePoseSelect = (pose: Pose) => {
  if (pose.isPremium && !subscription.hasPremiumAccess()) {
    navigation.openBottomSheet('paywall') // Let paywall store handle subscription
  } else {
    pose.setSelectedPose(pose) // Update pose store
  }
}
```

### Error Handling Pattern

Each store handles its own errors:

- **userStore**: Authentication errors, profile update failures
- **subscriptionStore**: Payment failures, plan limit errors
- **generationStore**: AI generation failures, timeout errors
- **navigationStore**: BottomSheet state conflicts

## 🛠️ Store Actions Reference

### navigationStore Actions

- `setPoseLibraryRef(ref)` - Register pose library BottomSheet ref
- `setPaywallRef(ref)` - Register paywall modal ref
- Access refs: `navigation.poseLibraryRef?.current?.expand()` - Control sheets via stored refs

## 🚀 Benefits of This Architecture

1. **Predictable**: Each store has clear responsibilities
2. **Testable**: Easy to mock individual stores for testing
3. **Scalable**: New features can add stores without affecting existing ones
4. **Type Safe**: Full TypeScript integration with Dream Pie types
5. **No Persistence**: Clean slate on each app launch (as requested)
6. **Domain-Driven**: Mirrors business logic and mockData structure

## 🔧 Development Guidelines

### When to Use Which Store

- **UI State**: Use `navigationStore` for BottomSheets, modals, loading states
- **Business Logic**: Use domain stores (`poseStore`, `photoStore`, etc.)
- **User Data**: Use `userStore` for authentication and profile
- **App State**: Use appropriate domain store, avoid putting everything in one place

### Adding New Features

1. Determine which domain the feature belongs to
2. Add actions to existing store OR create new domain store
3. Update types in `@/types/dream` if needed
4. Add mock data in `@/mockData/dream` for development
5. Update this documentation

### Testing Strategy

Each store can be tested independently:

```typescript
import { poseStore } from '@/stores'

test('should select pose correctly', () => {
  const testPose = mockPoses[0]
  poseStore.setSelectedPose(testPose)
  expect(poseStore.selectedPose).toBe(testPose)
})
```

This systematic approach ensures maintainable, predictable state management that scales with Dream Pie's growth.

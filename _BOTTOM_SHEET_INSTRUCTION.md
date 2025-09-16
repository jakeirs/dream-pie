# BottomSheet Component Usage Guide

## Overview
The `BottomSheet` component is a professional wrapper around `@gorhom/bottom-sheet` library that provides consistent styling, default behaviors, and simplified usage patterns. It supports both **regular BottomSheet** and **Modal BottomSheet** modes with configurable scroll behavior.

## Key Features
- **Dual Mode Support**: Regular BottomSheet and Modal mode
- **Configurable Scrolling**: Choose between ScrollView and View containers
- **Professional Defaults**: Pre-configured styling and behaviors
- **TypeScript Support**: Full type safety with proper interfaces
- **Gesture Integration**: Pan-down-to-close and backdrop dismiss
- **Theme Integration**: Uses project's color system (`brandColors`)

---

## Import & Basic Setup

### Import Statement
```typescript
import { BottomSheet } from '@/components/ui'
import BottomSheetLib, { BottomSheetModal } from '@gorhom/bottom-sheet'
```

### Ref Setup
```typescript
import React, { useRef } from 'react'

// For Regular BottomSheet
const bottomSheetRef = useRef<BottomSheetLib>(null)

// For Modal BottomSheet
const modalRef = useRef<BottomSheetModal>(null)
```

---

## Component Props

### Core Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `React.ReactNode` | **Required** | Content to display inside the sheet |
| `scrollView` | `boolean` | `true` | Toggle between ScrollView/View container |
| `isModal` | `boolean` | `false` | Enable modal mode (full overlay) |
| `index` | `number` | `0` | Initial snap point index |
| `snapPoints` | `string[]` | `['50%', '90%']` | Height percentages for snap positions |
| `enablePanDownToClose` | `boolean` | `true` | Allow pan gesture to close sheet |
| `backdropAppearsIndex` | `number` | `0` | Index when backdrop appears |

### Extended Props
All `@gorhom/bottom-sheet` props are supported for advanced customization.

---

## Usage Patterns

### 1. Regular BottomSheet (Persistent)

**Use Case**: Content that stays visible at bottom of screen, can expand/collapse

```typescript
import React, { useRef } from 'react'
import { BottomSheet } from '@/components/ui'
import BottomSheetLib from '@gorhom/bottom-sheet'

const MyComponent = () => {
  const sheetRef = useRef<BottomSheetLib>(null)

  const handleExpand = () => {
    sheetRef.current?.expand() // Go to highest snap point
  }

  const handleCollapse = () => {
    sheetRef.current?.collapse() // Go to lowest snap point
  }

  return (
    <>
      {/* Your main content */}

      {/* Regular BottomSheet */}
      <BottomSheet
        ref={sheetRef}
        isModal={false}
        snapPoints={['25%', '50%', '90%']}
        index={1} // Start at middle snap point
        scrollView={true}>
        <YourSheetContent />
      </BottomSheet>
    </>
  )
}
```

**Control Methods**:
- `sheetRef.current?.expand()` - Go to highest snap point
- `sheetRef.current?.collapse()` - Go to lowest snap point
- `sheetRef.current?.close()` - Completely hide sheet
- `sheetRef.current?.snapToIndex(1)` - Go to specific snap point

---

### 2. Modal BottomSheet (Overlay)

**Use Case**: Full-screen overlays, forms, detail views that appear on demand

```typescript
import React, { useRef } from 'react'
import { BottomSheet } from '@/components/ui'
import { BottomSheetModal } from '@gorhom/bottom-sheet'

const MyComponent = () => {
  const modalRef = useRef<BottomSheetModal>(null)

  const openModal = () => {
    modalRef.current?.present() // Show modal
  }

  const closeModal = () => {
    modalRef.current?.dismiss() // Hide modal
  }

  return (
    <>
      <Button onPress={openModal}>Open Modal</Button>

      {/* Modal BottomSheet */}
      <BottomSheet
        ref={modalRef}
        isModal={true}
        scrollView={true}>
        <YourModalContent />
      </BottomSheet>
    </>
  )
}
```

**Control Methods**:
- `modalRef.current?.present()` - Show modal
- `modalRef.current?.dismiss()` - Hide modal

---

## When to Use Each Mode

### Use Regular BottomSheet When:
- ✅ **Persistent UI elements** (music player, mini cart, quick actions)
- ✅ **Multi-state content** that users interact with frequently
- ✅ **Secondary navigation** or tool panels
- ✅ **Content preview** that users can expand for details

### Use Modal BottomSheet When:
- ✅ **Forms and inputs** that need user focus
- ✅ **Detail views** for specific items
- ✅ **Confirmation dialogs** or action sheets
- ✅ **Full-screen experiences** within a modal context

---

## ScrollView vs View Configuration

### `scrollView={true}` (Default)
**Use for**: Long content that needs vertical scrolling

```typescript
<BottomSheet scrollView={true}>
  <Text>Long content...</Text>
  <Text>More content...</Text>
  {/* Content scrolls vertically */}
</BottomSheet>
```

### `scrollView={false}`
**Use for**: Fixed height content, forms, controls

```typescript
<BottomSheet scrollView={false}>
  <View className="p-6">
    <Button>Fixed Action</Button>
    <TextInput placeholder="Form field" />
  </View>
</BottomSheet>
```

---

## Real Implementation Examples

### Example 1: Pose Library (Multi-Snap Regular Sheet)

```typescript
import React, { useRef } from 'react'
import { BottomSheet } from '@/components/ui'
import BottomSheetLib from '@gorhom/bottom-sheet'
import PoseLibraryContent from '@/components/PAGE/pose-library'

const CreatePage = () => {
  const poseLibraryRef = useRef<BottomSheetLib>(null)

  const handlePoseChange = () => {
    poseLibraryRef.current?.expand()
  }

  return (
    <>
      <Button onPress={handlePoseChange}>Choose Pose</Button>

      <BottomSheet
        ref={poseLibraryRef}
        isModal={false}
        enablePanDownToClose={false}
        scrollView={false}
        snapPoints={['30%', '60%', '95%']}
        backdropAppearsIndex={1}
        index={1}>
        <PoseLibraryContent onClose={() => poseLibraryRef.current?.close()} />
      </BottomSheet>
    </>
  )
}
```

### Example 2: Paywall Modal

```typescript
import React, { useRef } from 'react'
import { BottomSheet } from '@/components/ui'
import { BottomSheetModal } from '@gorhom/bottom-sheet'
import PaywallContent from '@/components/PAGE/paywall'

const CreatePage = () => {
  const paywallRef = useRef<BottomSheetModal>(null)

  const handlePaywallOpen = () => {
    paywallRef.current?.present()
  }

  return (
    <>
      <Button onPress={handlePaywallOpen}>Buy Premium</Button>

      <BottomSheet ref={paywallRef} isModal={true} scrollView={true}>
        <PaywallContent onClose={() => paywallRef.current?.dismiss()} />
      </BottomSheet>
    </>
  )
}
```

---

## Default Configurations

### Regular BottomSheet Defaults
```typescript
{
  snapPoints: ['50%', '90%'],
  index: 0,
  enablePanDownToClose: true,
  scrollView: true,
  handleIndicatorStyle: { backgroundColor: brandColors.textMuted },
  backgroundStyle: { backgroundColor: brandColors.card },
  backdropComponent: CustomBackdrop (opacity: 0.7)
}
```

### Modal BottomSheet Defaults
```typescript
{
  snapPoints: ['100%'],
  index: 0,
  enablePanDownToClose: true,
  scrollView: true,
  enableDynamicSizing: false,
  handleIndicatorStyle: { backgroundColor: brandColors.textMuted },
  backgroundStyle: { backgroundColor: brandColors.card },
  backdropComponent: CustomBackdrop (opacity: 0.7)
}
```

---

## Advanced Customization

### Custom Snap Points
```typescript
<BottomSheet
  snapPoints={['25%', '50%', '75%', '95%']}
  index={2} // Start at 75%
>
```

### Disable Pan-to-Close
```typescript
<BottomSheet
  enablePanDownToClose={false}
  backdropAppearsIndex={-1} // No backdrop
>
```

### Custom Backdrop Behavior
```typescript
<BottomSheet
  backdropAppearsIndex={1} // Backdrop appears at second snap point
>
```

---

## Common Patterns & Best Practices

### 1. **Integration with Zustand Store**
```typescript
const { navigation } = useAppStores()

// Open via store action
const openPaywall = () => navigation.openBottomSheet('paywall')
```

### 2. **Content Components Pattern**
Create dedicated content components for each sheet:
```
components/PAGE/
├── pose-library/
│   └── index.tsx
├── paywall/
│   └── index.tsx
└── profile-settings/
    └── index.tsx
```

### 3. **Close Handlers**
Always provide close functionality to content:
```typescript
<YourSheetContent
  onClose={() => sheetRef.current?.close()}
/>
```

### 4. **Validation Before Actions**
```typescript
const handleAction = () => {
  if (!isValid) {
    sheetRef.current?.expand() // Show validation errors
    return
  }
  // Proceed with action
}
```

---

## Troubleshooting

### Common Issues

**1. Sheet Not Opening**
- ✅ Check ref is properly attached: `ref={sheetRef}`
- ✅ Verify ref type matches mode (BottomSheetLib vs BottomSheetModal)

**2. Content Not Scrolling**
- ✅ Use `scrollView={true}` for long content
- ✅ Ensure content height exceeds snap point height

**3. Backdrop Not Working**
- ✅ Check `backdropAppearsIndex` setting
- ✅ Verify `index` is greater than `backdropAppearsIndex`

**4. TypeScript Errors**
- ✅ Import correct ref types
- ✅ Match ref type with `isModal` prop

### Metro Cache Issues
If components aren't updating:
```bash
npx kill-port 8081 8083 8084 8085 8086 8087
npm start -- --reset-cache
```

---

## Quick Reference

### Regular BottomSheet Commands
```typescript
sheetRef.current?.expand()        // Go to highest snap point
sheetRef.current?.collapse()      // Go to lowest snap point
sheetRef.current?.close()         // Hide completely
sheetRef.current?.snapToIndex(1)  // Go to specific index
```

### Modal BottomSheet Commands
```typescript
modalRef.current?.present()   // Show modal
modalRef.current?.dismiss()   // Hide modal
```

### Choosing Configuration
- **Long scrollable content** → `scrollView={true}`
- **Fixed forms/controls** → `scrollView={false}`
- **Persistent UI** → `isModal={false}`
- **Focus overlays** → `isModal={true}`
# My Expo App - CLAUDE.md

## Project Overview
React Native Expo app demonstrating **React Native Reanimated 4.1.0** and **@gorhom/bottom-sheet** integration with **Expo Router** navigation and **NativeWind** styling. Features a professional component architecture with organized folder structure.

## Current Architecture

### Dependencies
- **Expo SDK**: 54.0.2
- **React Native**: 0.81.4
- **Expo Router**: File-based routing system
- **React Native Reanimated**: 4.1.0
- **@gorhom/bottom-sheet**: 5.2.6
- **NativeWind**: Latest (Tailwind CSS for React Native)
- **React Native Gesture Handler**: 2.28.0
- **React Native Safe Area Context**: 5.6.0
- **babel-plugin-module-resolver**: 5.0.2 (Path aliases support)

## 🔗 **Path Alias System**

This project implements a comprehensive **absolute import alias system** to simplify imports and improve code maintainability. The system is configured across Babel, Metro, and TypeScript for full compatibility.

### **🚀 Available Aliases**

| Alias | Path | Usage |
|-------|------|--------|
| `@` | `./` (root) | Root directory access |
| `@/components` | `./components` | All components |
| `@/components/ui` | `./components/ui` | UI component library |
| `@/components/PAGE` | `./components/PAGE` | Page components |
| `@/assets` | `./assets` | Static assets |
| `@/app` | `./app` | App directory |
| `@/types` | `./types` | TypeScript interfaces |
| `@/mockData` | `./mockData` | Mock data files |

### **✅ Correct Usage Examples**

#### **Route Files (app/ directory):**
```typescript
// ✅ CORRECT - Based on actual working patterns

// Special case: "index" folder requires explicit /index
import IndexPage from '@/components/PAGE/index/index';

// Normal case: other folders work with auto-resolution
import ExplorePage from '@/components/PAGE/explore';       // ✅ WORKS (auto-resolves)
import ProfilePage from '@/components/PAGE/profile';       // ✅ WORKS (auto-resolves)

// These also work but are optional for non-index folders:
import ExplorePage from '@/components/PAGE/explore/index'; // ✅ ALSO WORKS
import ProfilePage from '@/components/PAGE/profile/index'; // ✅ ALSO WORKS

// ❌ INCORRECT - This specific pattern fails
import IndexPage from '@/components/PAGE/index';  // ❌ FAILS - Metro can't resolve this

// Example usage:
// app/(tabs)/index.tsx
export default function IndexScreen() {
  return <IndexPage />;
}

// app/(tabs)/explore.tsx
export default function ExploreScreen() {
  return <ExplorePage />;
}
```

#### **Component Files:**
```typescript
// ✅ UI Components
import { Button, Card, AnimatedBox, BottomSheet } from '@/components/ui';

// ✅ Assets
import logo from '@/assets/images/logo.png';
import icon from '@/assets/icons/star.svg';

// ✅ Page Components (when importing between pages)
import HomePage from '@/components/PAGE/index/index';

// ✅ Types and Mock Data
import { User, Post } from '@/types';
import { mockUsers, mockPosts } from '@/mockData';
```

### **🔧 Configuration Files**

#### **babel.config.js**
```javascript
module.exports = function (api) {
  api.cache(true);
  let plugins = [
    'react-native-worklets/plugin',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@': './',
          '@/components': './components',
          '@/components/ui': './components/ui',
          '@/components/PAGE': './components/PAGE',
          '@/assets': './assets',
          '@/app': './app',
          'tailwind.config': './tailwind.config.js',
        },
      },
    ],
  ];

  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins,
  };
};
```

#### **metro.config.js**
```javascript
const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Extract resolver to preserve existing properties
const { resolver } = config;

config.resolver = {
  ...resolver,
  alias: {
    '@': path.resolve(__dirname, '.'),
    '@/components': path.resolve(__dirname, './components'),
    '@/components/ui': path.resolve(__dirname, './components/ui'),
    '@/components/PAGE': path.resolve(__dirname, './components/PAGE'),
    '@/assets': path.resolve(__dirname, './assets'),
    '@/app': path.resolve(__dirname, './app'),
  },
};

module.exports = withNativeWind(config, { input: './global.css' });
```

#### **tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"],
      "@/components/*": ["./components/*"],
      "@/components/ui/*": ["./components/ui/*"],
      "@/components/PAGE/*": ["./components/PAGE/*"],
      "@/assets/*": ["./assets/*"],
      "@/app/*": ["./app/*"]
    }
  }
}
```

### **⚠️ Critical Import Rules**

#### **1. Page Component Imports (Most Important)**

**📁 Actual File Structure:**
```
components/PAGE/
├── index/
│   └── index.tsx      # Main component file
└── explore/
    └── index.tsx      # Main component file
```

**✅ CORRECT Import Patterns:**
```typescript
// Special case: "index" folder requires double index
import IndexPage from '@/components/PAGE/index/index';

// Normal case: other folders can omit the /index
import ExplorePage from '@/components/PAGE/explore';  // ✅ WORKS
// OR with explicit /index (also works)
import ExplorePage from '@/components/PAGE/explore/index'; // ✅ ALSO WORKS

// ❌ This FAILS because there's no automatic index resolution for "index" folder
import IndexPage from '@/components/PAGE/index';  // ❌ FAILS - Metro can't resolve
```

**🔍 Critical Rule**: The folder named `index` requires the explicit `/index` file name because Metro bundler cannot auto-resolve `@/components/PAGE/index` to `@/components/PAGE/index/index.tsx`. For all other folder names, Metro can auto-resolve to the `index.tsx` file inside.

#### **2. UI Component Imports**
```typescript
// ✅ Import from the main UI index (recommended)
import { Button, Card } from '@/components/ui';

// ✅ Import specific components (also works)
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
```

#### **3. Asset Imports**
```typescript
// ✅ Static assets
import heroImage from '@/assets/images/hero.png';
import appIcon from '@/assets/icons/app-icon.svg';

// ✅ Fonts and other assets
import customFont from '@/assets/fonts/custom.ttf';
```

### **🚨 Common Pitfalls**

#### **Metro Bundling Errors**
```bash
# Error: "Unable to resolve module @/components/PAGE"
# Cause: Trying to import "index" folder without explicit file name

# The ONLY problematic pattern:
# ❌ Wrong: import IndexPage from '@/components/PAGE/index';
# ✅ Fix:   import IndexPage from '@/components/PAGE/index/index';

# All other folders work fine with auto-resolution:
# ✅ Works: import ExplorePage from '@/components/PAGE/explore';
# ✅ Works: import ProfilePage from '@/components/PAGE/profile';
```

#### **TypeScript Errors**
```bash
# Error: "Cannot find module '@/components'"
# Cause: TypeScript path mapping not configured
# ✅ Fix: Verify tsconfig.json paths are correct
```

### **🛠️ Troubleshooting Aliases**

#### **Testing Alias Resolution**
```bash
# 1. Check TypeScript compilation
npx tsc --noEmit

# 2. Clear Metro cache and restart
npm start -- --reset-cache --clear

# 3. Verify all config files are correct
# Check: babel.config.js, metro.config.js, tsconfig.json
```

#### **Common Solutions**
```bash
# If aliases don't work:
1. Restart development server completely
2. Clear all caches: npm start -- --reset-cache
3. Check file paths match exactly
4. Verify babel-plugin-module-resolver is installed
5. Ensure Metro config preserves existing resolver properties
```

### 🚀 **React Native Reanimated 4.x Gesture API**

**IMPORTANT**: This project uses **Reanimated 4.1.0** which requires the **new Gesture API**. The old `useAnimatedGestureHandler` API has been **removed** and will cause crashes.

#### **✅ Correct Gesture Implementation (Reanimated 4.x)**
```typescript
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  runOnJS 
} from 'react-native-reanimated';

const gesture = Gesture.Pan()
  .onStart(() => {
    scale.value = withSpring(1.05);
  })
  .onUpdate((event) => {
    translateX.value = event.translationX;
  })
  .onEnd(() => {
    scale.value = withSpring(1);
    translateX.value = withSpring(0);
    if (onPress) {
      runOnJS(onPress)();
    }
  });

return <GestureDetector gesture={gesture}>{content}</GestureDetector>;
```

#### **🎯 Gesture Types and Methods**
```typescript
// Pan Gesture - Touch and drag interactions
const panGesture = Gesture.Pan()
  .onStart(() => {})      // Gesture begins
  .onUpdate((event) => {}) // Active dragging (replaces onActive)
  .onEnd(() => {});       // Gesture ends

// Tap Gesture - Single touch interactions  
const tapGesture = Gesture.Tap()
  .onStart(() => {})
  .onEnd(() => {});

// Long Press Gesture - Extended touch
const longPressGesture = Gesture.LongPress()
  .minDuration(500)
  .onStart(() => {})
  .onEnd(() => {});

// Combined Gestures
const combinedGesture = Gesture.Race(panGesture, tapGesture);
```

#### **🔧 Migration Guide: Old API → New API**
```typescript
// OLD (Reanimated 2.x/3.x) ❌
useAnimatedGestureHandler({
  onStart: () => {},
  onActive: (event) => {},  // ❌ onActive removed
  onEnd: () => {}
});

// NEW (Reanimated 4.x) ✅
Gesture.Pan()
  .onStart(() => {})
  .onUpdate((event) => {})  // ✅ onUpdate replaces onActive
  .onEnd(() => {});
```

#### **❌ Deprecated Implementation (Will Crash)**
```typescript
// DON'T USE - This will cause TypeError in Reanimated 4.x
import { useAnimatedGestureHandler } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';

const gestureHandler = useAnimatedGestureHandler({
  onStart: () => { /* ... */ },
  onActive: (event) => { /* ... */ },
  onEnd: () => { /* ... */ },
});

return <PanGestureHandler onGestureEvent={gestureHandler}>{content}</PanGestureHandler>;
```

#### **📝 Real Implementation Example: Interactive Card**
```typescript
// components/ui/Card/Card.tsx - Production Implementation
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

export const Card = ({ interactive = false, onPress, children }) => {
  const scale = useSharedValue(1);
  const rotateY = useSharedValue(0);
  const translateX = useSharedValue(0);

  // ✅ New Gesture API Implementation
  const gesture = Gesture.Pan()
    .onStart(() => {
      if (interactive) {
        scale.value = withSpring(1.05);
      }
    })
    .onUpdate((event) => {
      if (interactive) {
        translateX.value = event.translationX * 0.1;
        rotateY.value = interpolate(event.translationX, [-100, 100], [-5, 5]);
      }
    })
    .onEnd(() => {
      if (interactive) {
        scale.value = withSpring(1);
        translateX.value = withSpring(0);
        rotateY.value = withSpring(0);
        if (onPress) {
          runOnJS(onPress)();
        }
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { translateX: translateX.value },
      { rotateY: `${rotateY.value}deg` },
    ],
  }));

  const content = (
    <Animated.View style={interactive ? animatedStyle : undefined}>
      {children}
    </Animated.View>
  );

  return interactive ? (
    <GestureDetector gesture={gesture}>{content}</GestureDetector>
  ) : (
    content
  );
};
```

## 🗂️ **Professional Folder Structure**

### **Complete App Structure**
```
my-expo-app/
├── app/                           # 📱 Expo Router - App Directory
│   ├── _layout.tsx                # Root layout with providers
│   ├── (tabs)/                    # Tab group routing
│   │   ├── _layout.tsx            # Tab navigation layout
│   │   ├── index.tsx              # 🔄 Imports from components/PAGE/index
│   │   └── explore.tsx            # 🔄 Imports from components/PAGE/explore
│   └── modal.tsx                  # Modal screen
│
├── components/                    # 🏗️ Component Architecture
│   ├── ui/                        # 🎨 Reusable UI Components
│   │   ├── Button/
│   │   │   ├── Button.tsx         # Animated button with variants
│   │   │   └── index.tsx          # Export file
│   │   ├── Card/
│   │   │   ├── Card.tsx           # Interactive card component
│   │   │   └── index.tsx          # Export file
│   │   ├── AnimatedBox/
│   │   │   ├── AnimatedBox.tsx    # Reusable animated container
│   │   │   └── index.tsx          # Export file
│   │   └── index.tsx              # Main UI component exports
│   │
│   └── PAGE/                      # 🎯 Page Components (Mirror Routing Structure)
│       ├── index/                 # Corresponds to app/(tabs)/index.tsx
│       │   ├── index.tsx          # Main page component
│       │   ├── components/        # Page-specific sub-components
│       │   │   └── index.tsx      # AnimationControls, FeatureList
│       │   ├── hooks.ts           # Page-specific custom hooks
│       │   └── types.ts           # Page-specific TypeScript interfaces
│       │
│       └── explore/               # Corresponds to app/(tabs)/explore.tsx
│           ├── index.tsx          # Main page component
│           ├── components/        # Page-specific sub-components
│           │   └── index.tsx      # InteractiveStar, FeatureShowcase
│           ├── hooks.ts           # Page-specific custom hooks
│           └── types.ts           # Page-specific TypeScript interfaces
│
├── shared/                        # 🔧 Shared utilities
│   └── constants/                 # App constants
├── hooks/                         # 🪝 Global custom hooks
├── assets/                        # 🖼️ Static assets
├── global.css                     # 🎨 Global styles
└── package.json                   # 📦 Dependencies
```

## 📋 **Developer Guidelines**

### **🔑 Core Architecture Principles**

#### **1. Single Responsibility Pattern**
- **Rule**: Each `app/` route file should contain **ONLY ONE COMPONENT IMPORT**
- **Pattern**: `app/(tabs)/[route].tsx` → `import PageComponent from '@/components/PAGE/[route]/index'`

**✅ Correct Example:**
```typescript
// app/(tabs)/index.tsx
import IndexPage from '@/components/PAGE/index/index';

export default function IndexScreen() {
  return <IndexPage />;
}
```

**❌ Incorrect Example:**
```typescript
// app/(tabs)/index.tsx - DON'T DO THIS
import React from 'react';
import { View, Text } from 'react-native';
// ... lots of component logic here
```

#### **2. Mirror Routing Structure in components/PAGE/**
- **Rule**: `components/PAGE/` folder structure must **exactly mirror** the `app/` routing structure
- **Purpose**: Makes navigation and component organization predictable

**Routing Structure Mapping:**
```
app/(tabs)/index.tsx        →  components/PAGE/index/
app/(tabs)/explore.tsx      →  components/PAGE/explore/
app/(tabs)/profile.tsx      →  components/PAGE/profile/
app/modal.tsx              →  components/PAGE/modal/
app/[id].tsx               →  components/PAGE/[id]/
```

#### **3. Page Component Structure**
Each page directory in `components/PAGE/` follows this **mandatory structure**:

```
components/PAGE/[pageName]/
├── index.tsx              # ✅ Main page component (default export)
├── components/            # ✅ Page-specific sub-components
│   └── index.tsx          # ✅ Export sub-components  
├── hooks.ts              # ✅ Page-specific custom hooks
└── types.ts              # ✅ Page-specific TypeScript types
```

**Example Implementation:**
```typescript
// components/PAGE/index/index.tsx
import React from 'react';
import { useAnimationControls } from './hooks';
import { AnimationControls } from './components';
import { IndexPageProps } from './types';

export default function IndexPage({ className = '' }: IndexPageProps) {
  const animations = useAnimationControls();
  
  return (
    <View className={`flex-1 ${className}`}>
      <AnimationControls animations={animations} />
    </View>
  );
}
```

#### **4. UI Component Organization**
- **Location**: `components/ui/`
- **Structure**: Each component in its own folder with TypeScript file and index export
- **Purpose**: Reusable components shared across multiple pages

```
components/ui/
├── Button/
│   ├── Button.tsx         # Component implementation
│   └── index.tsx          # Export: export { Button } from './Button';
├── Card/
│   ├── Card.tsx
│   └── index.tsx
└── index.tsx             # Main exports: export * from './Button';
```

### **🚀 Expo Router Best Practices**

#### **File-Based Routing Rules**
1. **Route Files**: Place in `app/` directory
2. **Layouts**: Use `_layout.tsx` for nested layouts
3. **Route Groups**: Use `(groupName)/` for organization without affecting URL
4. **Dynamic Routes**: Use `[param].tsx` for dynamic segments
5. **Import Pattern**: Always import from corresponding `components/PAGE/` directory

#### **Navigation Flow**
```
User Request → app/[route].tsx → components/PAGE/[route]/index.tsx → Render UI
```

#### **Example Route Structure**
```typescript
// app/(tabs)/_layout.tsx - Tab Layout
export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}

// app/(tabs)/index.tsx - Home Route
import IndexPage from '@/components/PAGE/index/index';
export default function IndexScreen() {
  return <IndexPage />;
}
```

### **📚 Component Development Workflow**

#### **Creating New Pages**
1. **Create Route**: Add file in `app/` directory
2. **Create Page Structure**: Create matching directory in `components/PAGE/`
3. **Implement Component**: Build page in `components/PAGE/[name]/index.tsx`
4. **Add Supporting Files**: Create `hooks.ts`, `types.ts`, `components/index.tsx`
5. **Import in Route**: Single import in `app/` route file

#### **Creating New UI Components**
1. **Create Folder**: `components/ui/[ComponentName]/`
2. **Implement Component**: Create `[ComponentName].tsx` with TypeScript
3. **Add Exports**: Create `index.tsx` export file
4. **Update Main Export**: Add to `components/ui/index.tsx`

## 📊 **Mock Data Architecture**

### **🏗️ Folder Structure**

This project implements a comprehensive, well-typed mock data system that follows TypeScript best practices and clear data lifecycle documentation.

```
my-expo-app/
├── types/                     # TypeScript interfaces
│   ├── users/
│   │   ├── user.ts           # User interface and related types
│   │   ├── userActivity.ts   # User activity tracking types
│   │   └── index.ts          # Export all user types
│   ├── content/
│   │   ├── post.ts           # Social media post types
│   │   ├── comment.ts        # Comment types
│   │   └── index.ts          # Export all content types
│   └── index.ts              # Main type exports
│
├── mockData/                  # Mock data (mirrors types structure)
│   ├── users/
│   │   ├── users.ts          # User mock data with lifecycle comments
│   │   ├── userActivity.ts   # User activity mock data
│   │   └── index.ts          # Export all user mock data
│   ├── content/
│   │   ├── posts.ts          # Social media posts mock data
│   │   ├── comments.ts       # Comments mock data
│   │   └── index.ts          # Export all content mock data
│   └── index.ts              # Main mock data exports
```

### **🎯 Data Lifecycle Documentation**

Every mock data file includes a mandatory header documenting the complete data lifecycle:

```typescript
/**
 * MOCK DATA LIFECYCLE - [Data Model Name]
 *
 * WHEN CREATED: [Description of when this data is generated]
 * WHERE CREATED: [Component/service that creates this data]
 *
 * WHEN USED: [Description of when this data is consumed]
 * WHERE USED: [Components/pages that use this data]
 *
 * HOW DATA EVOLVES:
 * - CREATE: [How new items are added]
 * - READ: [How data is fetched/displayed]
 * - UPDATE: [How data is modified]
 * - DELETE: [How data is removed]
 *
 * RELATIONSHIPS: [Data dependencies and connections]
 */
```

### **🔗 Path Aliases for Mock Data**

The project includes dedicated path aliases for the mock data system:

| Alias | Path | Usage |
|-------|------|--------|
| `@/types` | `./types` | TypeScript interfaces |
| `@/mockData` | `./mockData` | Mock data files |

**Usage Examples:**
```typescript
// ✅ Correct imports
import { User, Post } from '@/types';
import { mockUsers, mockPosts } from '@/mockData';

// ✅ Specific imports
import { mockPostsWithAuthors } from '@/mockData/content';
import { UserActivity } from '@/types/users';
```

### **📝 Mock Data Guidelines for AI Agents**

#### **When to Create Mock Data**
- **User Request**: When user explicitly asks for mock data
- **Testing Features**: When implementing/testing functionality that requires data
- **Demo Purposes**: When showcasing app features
- **Development**: When components need sample data for development

#### **How to Create Mock Data**
1. **Create Types First**: Always define TypeScript interfaces in `types/` before creating mock data
2. **Follow Structure**: Mirror the exact folder structure between `types/` and `mockData/`
3. **Add Lifecycle Comments**: Include the mandatory lifecycle documentation header
4. **Use Helper Functions**: Create utility functions for data access (getById, filter, etc.)
5. **Keep It Simple**: Avoid overly complex data structures unless specifically requested

#### **Mock Data Creation Checklist**
- [ ] TypeScript interface defined in `types/`
- [ ] Mock data file created in corresponding `mockData/` folder
- [ ] Lifecycle documentation header included
- [ ] Data relationships documented
- [ ] Helper functions provided (if applicable)
- [ ] Export statements added to index files
- [ ] Path aliases used correctly

#### **Example Implementation Pattern**

**1. Define Types:**
```typescript
// types/users/user.ts
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
}
```

**2. Create Mock Data:**
```typescript
// mockData/users/users.ts
/**
 * MOCK DATA LIFECYCLE - Users
 * [Complete lifecycle documentation]
 */

import { User } from '@/types/users';

export const mockUsers: User[] = [
  // Simple, realistic data
];

export const getUserById = (id: string): User | undefined => {
  return mockUsers.find(user => user.id === id);
};
```

**3. Use in Components:**
```typescript
// Component usage
import { mockUsers } from '@/mockData';
// Use mockUsers in component
```

### **🚨 Important Rules**

#### **✅ DO:**
- Keep mock data simple and focused on the task at hand
- Include lifecycle documentation headers
- Follow the established folder structure exactly
- Create helper functions for common operations
- Use TypeScript interfaces consistently
- Document data relationships clearly

#### **❌ DON'T:**
- Create overly complex mock data structures
- Skip lifecycle documentation
- Mix different data models in the same file
- Ignore the folder structure patterns
- Create mock data without corresponding types
- Use relative imports (always use path aliases)

## Current Features

### **Home Tab (`components/PAGE/index/`)**
- **Advanced Animations**: 10 animation types (scale, rotate, bounce, shake, fade, color, spin, slide, flip, pulse)
- **Bottom Sheet**: Multi-snap point modal (25%, 50%, 90%) with gesture handling displaying typed mock data
- **Mock Data Display**: Users and posts with proper TypeScript typing
- **Reusable Components**: Uses `Button` and `Card` from UI library
- **Custom Hooks**: `useAnimationControls` for animation management

### **Explore Tab (`components/PAGE/explore/`)**
- **Interactive Cards**: Tap-to-expand feature showcase cards
- **Animated Star**: Interactive star with counter and reset functionality
- **Feature Documentation**: Detailed information about app capabilities
- **User Journey**: Step-by-step app navigation guide

### **UI Component Library (`components/ui/`)**
- **Button**: 6 variants (primary, secondary, success, warning, danger, info) with animations
- **Card**: Interactive cards with gesture support and variant styling
- **AnimatedBox**: Versatile animated container with multiple animation types
- **BottomSheet**: Reusable wrapper for @gorhom/bottom-sheet with predefined settings

### **BottomSheet Component (`components/ui/BottomSheet/`)**

**Overview**: Reusable wrapper for @gorhom/bottom-sheet with professional defaults and configurable scroll behavior.

**Default Configuration**:
- Snap points: `['50%', '90%']`
- Backdrop with 50% opacity and auto-dismiss
- Pan-down-to-close enabled
- Professional styling with NativeWind

**Import Pattern**:
```typescript
import { BottomSheet } from '@/components/ui';
import type { BottomSheetProps } from '@/components/ui';
```

**Props**:
- `scrollView?: boolean` (default: true) - Toggles between BottomSheetScrollView/BottomSheetView
- `children: React.ReactNode` - Content to display
- All @gorhom/bottom-sheet props supported for customization

**Basic Usage**:
```typescript
import React, { useRef } from 'react';
import { BottomSheet } from '@/components/ui';
import BottomSheetLib from '@gorhom/bottom-sheet';

const MyComponent = () => {
  const bottomSheetRef = useRef<BottomSheetLib>(null);

  return (
    <BottomSheet ref={bottomSheetRef} scrollView={true}>
      <YourContent />
    </BottomSheet>
  );
};
```

**Integration Pattern**:
- ✅ Import directly into existing page components (`components/PAGE/[route]/index.tsx`)
- ✅ Use `useRef` for programmatic control (expand, close, etc.)
- ✅ No separate routing structure needed - integrate within existing components
- ✅ Choose `scrollView={true}` for long content, `scrollView={false}` for forms/controls

## **Port Management (localhost:8081)**

**IMPORTANT**: Always use port 8081 for development and testing consistency.

### **When Port 8081 is in Use:**

### **Method 1: Kill All Ports (Recommended)**

```bash
# Kill all processes on ports 8081-8087
npx kill-port 8081 8083 8084 8085 8086 8087

# Then start fresh on default port 8081
npm start -- --reset-cache
```

### **Method 2: Check What's Using the Port**

```bash
# Check which processes are using port 808x
netstat -ano | findstr :808

# Kill specific process by PID if needed
# Note: Replace XXXX with actual PID from netstat output
```

### **Method 3: Alternative Port Check**

```bash
# Check if port 8081 specifically is free
netstat -ano | findstr :8081
```

### **Testing Configuration**

- Playwright tests are configured for `http://localhost:8081`
- Always ensure `playwright.config.ts` uses `baseURL: "http://localhost:8081"`
- Never change to alternative ports unless absolutely necessary

### **Common Issues**

- Multiple background bash processes can leave ports occupied
- Use `npx kill-port` to clean up all development ports at once
- Always start fresh with `npm start -- --reset-cache` after cleaning ports

## 🧪 **Testing & Quality Assurance Workflow**

### **🚀 AI Agent Development Protocol**

**MANDATORY WORKFLOW**: When implementing features or tasks, AI agents MUST follow this testing protocol:

#### **📋 Step 1: Read Project Configuration**
```bash
# Always start by reading these files
# 1. CLAUDE.md - Project architecture and guidelines
# 2. package.json - Available scripts and dependencies
```

#### **🛠️ Step 2: Port Management & App Startup**
```bash
# Ensure clean development environment
npx kill-port 8081 8083 8084 8085 8086 8087

# Start development server on port 8081
npm start -- --reset-cache

# IMPORTANT: Always use port 8081 for consistency
# Wait for "Metro waiting on exp://192.168.x.x:8081" message
```

#### **🔍 Step 3: Feature Testing Protocol**

**Basic Functionality Test:**
```bash
# Navigate to feature page/component in browser
# Visit: http://localhost:8081
# Test core functionality manually
# Verify no crashes or errors in console
```

**Automated Test Execution:**
```bash
# Run specific feature tests
npm run test

# Debug mode for step-by-step verification
npm run test:debug

# Test specific files
npx playwright test tests/[feature-name].spec.ts
```

#### **📊 Step 4: Error Analysis & Log Monitoring**

**Monitor Development Logs:**
```bash
# Watch for these error patterns in terminal:
# ❌ "Error: Unable to resolve module" - Import/path issues
# ❌ "TypeError" - Reanimated 4.x gesture API issues
# ❌ "ReferenceError" - Component/hook not found
# ❌ "Metro bundler failed" - Build issues
# ❌ "Network request failed" - Port/connectivity issues
```

**Browser Console Monitoring:**
```bash
# Open browser DevTools (F12)
# Check Console tab for errors:
# ❌ Red errors = Critical issues
# ⚠️ Yellow warnings = Non-critical but should fix
# ✅ No errors = Solution working correctly
```

#### **✅ Step 5: Solution Validation Checklist**

**Pre-Completion Requirements:**
- [ ] App starts without errors on port 8081
- [ ] Feature page loads without crashes
- [ ] Core functionality works as expected
- [ ] No console errors in browser DevTools
- [ ] No terminal errors in development server
- [ ] Existing features still work (regression test)
- [ ] Code follows project architecture patterns

#### **🔧 Step 6: Code Quality & Linting**
```bash
# MANDATORY: Run before marking task complete
npm run lint          # Check for linting errors
npm run format        # Fix formatting issues

# Fix any reported issues before completion
```

### **🎯 Feature Development Testing Process**

#### **Creating New Components/Features:**

**1. Implementation Phase:**
```bash
# Follow architecture patterns from CLAUDE.md
# Use established folder structure
# Implement with TypeScript interfaces
# Follow Reanimated 4.x Gesture API guidelines
```

**2. Basic Testing:**
```bash
# Start development server
npm start -- --reset-cache

# Navigate to feature in browser
# Test basic functionality
# Verify animations/gestures work
# Check for console errors
```

**3. Integration Testing:**
```bash
# Test feature with existing components
# Verify navigation works
# Test with different screen sizes
# Verify responsive behavior
```

**4. Automated Testing:**
```bash
# Create or update test files in /tests/ directory
# Run test suite
npm run test

# Take screenshots for visual verification
# Update test cases as needed
```

### **🚨 Common Issues & Solutions**

#### **Port Conflicts:**
```bash
# Error: "Port 8081 is already in use"
npx kill-port 8081 8083 8084 8085 8086 8087
npm start -- --reset-cache
```

#### **Gesture API Errors:**
```bash
# Error: "useAnimatedGestureHandler is not a function"
# Solution: Use new Reanimated 4.x API
# ✅ Use: Gesture.Pan() with GestureDetector
# ❌ Don't use: useAnimatedGestureHandler
```

#### **Import Resolution:**
```bash
# Error: "Unable to resolve module @/components"
# Check: tsconfig.json path mappings
# Verify: File exists at specified path
# Solution: Use correct relative imports
```

#### **Build Failures:**
```bash
# Clear Metro cache and restart
npm start -- --reset-cache --clear

# Check for TypeScript errors
npx tsc --noEmit

# Verify all imports are correct
```

### **📈 Testing Strategy by Feature Type**

#### **UI Components (components/ui/):**
- Visual rendering test
- Interactive behavior test
- Props validation test
- Animation performance test

#### **Page Components (components/PAGE/):**
- Route navigation test
- Component integration test
- Data flow test
- User interaction test

#### **Animations & Gestures:**
- Gesture response test
- Animation smoothness test
- Performance under load test

#### **Bottom Sheets & Modals:**
- Open/close functionality test
- Gesture handling test
- Snap points behavior test
- Backdrop interaction test

## Development Commands

### **Development Server**
```bash
npm start              # Start Expo development server (port 8081)
npm run android        # Run on Android device/emulator
npm run ios           # Run on iOS device/simulator
npm run web           # Run in web browser
```

### **Testing & Quality Assurance**
```bash
# Testing
npm run test          # Run Playwright test suite
npm run test:debug    # Run tests with visual debugging
npx playwright test   # Run all tests
npx playwright test --headed  # Run with browser visible

# Code Quality
npm run lint          # Check linting and formatting
npm run format        # Auto-fix linting and formatting issues

# Port Management
npx kill-port 8081 8083 8084 8085 8086 8087  # Clean up ports
netstat -ano | findstr :8081                  # Check port usage
```

### **Build & Deployment**
```bash
npm run prebuild      # Prepare for native build
expo build           # Build production app (if configured)
```

### **Debugging & Analysis**
```bash
# Clear cache and restart
npm start -- --reset-cache --clear

# TypeScript checking
npx tsc --noEmit

# Bundle analysis
npx expo export --dump-sourcemap
```

## 🎯 **Development Rules**

### **✅ DO:**
- Keep route files in `app/` minimal (single import only)
- Mirror routing structure exactly in `components/PAGE/`
- Use TypeScript interfaces for all components
- Create reusable UI components in `components/ui/`
- Follow the established folder structure religiously
- Use custom hooks for complex logic
- Implement proper error boundaries
- **ALWAYS use absolute imports with aliases (e.g., `@/components/ui`)**
- **Include full file paths for PAGE components: `@/components/PAGE/index/index`**
- **ALWAYS use the new Gesture API with `Gesture.Pan()` and `GestureDetector`**
- **Use `onUpdate()` instead of `onActive()` for gesture events**
- **Import gestures from `react-native-gesture-handler`, NOT `react-native-reanimated`**
- **MANDATORY: Follow the 6-step AI Agent Development Protocol**
- **Test every feature by running the app and verifying functionality**
- **Monitor terminal and browser console for errors during development**
- **Run `npm run lint` and `npm run format` before completing tasks**
- **Validate solutions work without crashing the app**

### **❌ DON'T:**
- Put business logic directly in `app/` route files
- Create components outside the established structure
- Mix page-specific and reusable UI components
- Skip TypeScript types and interfaces
- Create deeply nested component structures
- Import multiple page components in route files
- **NEVER use relative imports (use aliases instead: `@/components/ui`)**
- **NEVER try to import "index" folder without explicit file name (`@/components/PAGE/index` ❌)**
- **REMEMBER: Only "index" folder needs explicit /index: `@/components/PAGE/index/index` ✅**
- **Other folders work fine with auto-resolution: `@/components/PAGE/explore` ✅**
- **NEVER use `useAnimatedGestureHandler` (removed in Reanimated 4.x)**
- **NEVER use `PanGestureHandler` directly (use `GestureDetector` instead)**
- **NEVER import gesture handlers from `react-native-reanimated`**
- **NEVER skip the testing protocol when implementing features**
- **NEVER mark tasks complete without running the app to verify functionality**
- **NEVER ignore console errors or terminal warnings**
- **NEVER deploy features that cause app crashes or console errors**

## Architecture Benefits

### **🔧 Maintainability**
- **Clear Separation**: Route logic separate from component implementation
- **Predictable Structure**: Easy to locate components and understand organization
- **Type Safety**: Full TypeScript support throughout the application

### **📈 Scalability**
- **Modular Design**: Easy to add new routes and pages
- **Reusable Components**: UI library grows with application needs
- **Code Organization**: Logical grouping prevents architectural debt

### **👥 Team Collaboration**
- **Consistent Patterns**: All developers follow same architectural principles
- **Clear Ownership**: Easy to identify which team member owns what code
- **Documentation**: Self-documenting structure with clear naming conventions

## 🤖 **AI Agent Quick Reference**

### **Essential Workflow for Every Task:**
1. **📋 Read CLAUDE.md and package.json** - Understand project setup
2. **🛠️ Clean ports and start app** - `npx kill-port 8081 8083 8084 8085 8086 8087 && npm start -- --reset-cache`
3. **🔍 Test feature manually** - Navigate to `http://localhost:8081` and verify functionality
4. **📊 Monitor logs** - Watch terminal and browser console for errors
5. **✅ Validate solution** - Ensure no crashes, errors, or regressions
6. **🔧 Run quality checks** - `npm run lint && npm run format`

### **Testing Commands Reference:**
```bash
# Start Development
npm start -- --reset-cache          # Clean start on port 8081

# Testing
npm run test                         # Run all tests
npm run test:debug                   # Debug tests visually
npx playwright test --headed         # Run with browser visible

# Quality
npm run lint                         # Check code quality
npm run format                       # Fix formatting

# Debugging
npx kill-port 8081 8083 8084 8085 8086 8087  # Clean ports
netstat -ano | findstr :8081                  # Check port status
```

### **Success Criteria Checklist:**
- [ ] App starts on port 8081 without errors
- [ ] Feature works as intended in browser
- [ ] No red errors in browser DevTools console
- [ ] No error messages in terminal/development server
- [ ] Existing functionality still works (no regressions)
- [ ] Code passes linting (`npm run lint`)
- [ ] Architecture patterns followed (components/ui/ or components/PAGE/)
- [ ] TypeScript types properly defined

**Remember**: Every feature implementation MUST include testing verification. No exceptions.
# My Expo App - CLAUDE.md

## Project Overview
React Native Expo app demonstrating **React Native Reanimated 4.1.0** and **@gorhom/bottom-sheet** integration with NativeWind styling.

## Current Architecture

### Dependencies
- **Expo SDK**: 54.0.2
- **React Native**: 0.81.4
- **React Native Reanimated**: 4.1.0
- **@gorhom/bottom-sheet**: 5.2.6
- **NativeWind**: Latest (Tailwind CSS for React Native)
- **React Native Gesture Handler**: 2.28.0
- **React Native Safe Area Context**: 5.6.0

### Current App Structure
```
my-expo-app/
├── App.tsx                 # Main app component with animations & bottom sheet demo
├── components/             # React components
├── assets/                 # Static assets
├── global.css             # Global styles
└── package.json           # Dependencies
```

### Current Features (App.tsx)
- **Reanimated Animations**: Scale, rotation, bounce, shake, fade, color interpolation, continuous rotation
- **Bottom Sheet**: Multi-snap point modal with gesture handling (25%, 50%, 90%)
- **NativeWind Styling**: Tailwind CSS classes for styling
- **Gesture Handling**: Full gesture support for interactions

## Development Commands
```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android
npm run ios           # Run on iOS  
npm run web           # Run on web

# Code Quality
npm run lint          # Lint and format check
npm run format        # Auto-fix linting and formatting

# Build
npm run prebuild      # Prepare for native build
```

## Next Steps - Expo Router Migration Plan

### Target Architecture (Based on dream-pie structure)
```
my-expo-app/
├── app/
│   ├── _layout.tsx           # Root layout with providers
│   ├── (tabs)/
│   │   ├── _layout.tsx       # Tab layout configuration
│   │   ├── index.tsx         # Home tab (current App.tsx content)
│   │   └── explore.tsx       # Explore tab
│   └── modal.tsx             # Modal screen
├── components/
│   ├── ui/                   # UI components
│   ├── PAGE/                 # Page components
│   └── haptic-tab.tsx        # Custom tab component
├── shared/
│   └── constants/            # App constants
├── hooks/                    # Custom hooks
├── global.css               # Global styles
└── expo-env.d.ts            # Expo environment types
```

### Dependencies to Add
- `expo-router`: ~6.0.0 (latest compatible)
- `@react-navigation/bottom-tabs`: ^7.4.0
- `@react-navigation/native`: ^7.1.8
- `expo-linking`: ~8.0.7
- `react-native-screens`: ~4.16.0

### Migration Steps
1. Install Expo Router and navigation dependencies
2. Update `package.json` main entry to `expo-router/entry`
3. Create `app/` directory structure with layouts
4. Move current App.tsx content to `app/(tabs)/index.tsx` as page component
5. Set up tab navigation with Home and Explore tabs
6. Configure root layout with providers (GestureHandler, SafeArea, BottomSheet)
7. Test navigation and user journey
8. Verify all animations and bottom sheet functionality work correctly

### Expected User Journey
1. **App Launch** → Lands on Home tab (current App.tsx demo)
2. **Tab Navigation** → Switch between Home and Explore tabs  
3. **Animations** → All current Reanimated animations work on Home tab
4. **Bottom Sheet** → Modal functionality preserved and accessible
5. **Navigation** → Smooth transitions between tabs with proper state management

## Notes
- All current functionality will be preserved
- Reanimated 4.1.0 and bottom-sheet integration maintained
- NativeWind styling system continues to work
- Gesture handling remains fully functional
- Added navigation structure for better app organization
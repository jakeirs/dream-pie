import React, { useCallback } from 'react'
import { View, Text, ScrollView } from 'react-native'
import { useExploreAnimations, useFeatureCards } from './hooks'
import { InteractiveStar, FeatureShowcase, NavigationSuccess, UserJourneyCard } from './components'
import { ExplorePageProps, FeatureCardData } from './types'
import { PageHeader, ICON_FAMILY_NAME } from '@/components/ui'

const featuresData: FeatureCardData[] = [
  {
    id: 'routing',
    title: 'File-based Routing',
    description: 'Expo Router provides powerful file-based routing system.',
    icon: '🗂️',
    variant: 'info',
    details: [
      'Automatic route generation from file structure',
      'Type-safe navigation with TypeScript',
      'Nested routes and layouts support',
      'Dynamic routes with parameters',
    ],
  },
  {
    id: 'animations',
    title: 'Reanimated Animations',
    description: 'Advanced animations with React Native Reanimated 4.1.0.',
    icon: '⚡',
    variant: 'success',
    details: [
      'Worklet-powered animations running on UI thread',
      'Gesture-driven interactions',
      'Complex animation sequences',
      'Smooth 60fps performance',
    ],
  },
  {
    id: 'bottomsheet',
    title: 'Bottom Sheet Modals',
    description: 'Beautiful modal experiences with @gorhom/bottom-sheet.',
    icon: '📋',
    variant: 'warning',
    details: [
      'Multiple snap points (25%, 50%, 90%)',
      'Gesture handling and backdrop',
      'Keyboard-aware behavior',
      'Custom handle and styling',
    ],
  },
  {
    id: 'styling',
    title: 'NativeWind Styling',
    description: 'Tailwind CSS utility classes for React Native.',
    icon: '🎨',
    variant: 'danger',
    details: [
      'Utility-first CSS framework',
      'Responsive design support',
      'Dark mode compatibility',
      'Consistent design system',
    ],
  },
]

export default function ExplorePage({ className = '' }: ExplorePageProps) {
  const animations = useExploreAnimations()
  const cards = useFeatureCards()

  const handleSearchPress = useCallback(() => {
    console.log('Search pressed!')
  }, [])

  return (
    <View className={`flex-1 bg-gray-100 ${className}`}>
      <PageHeader
        title="Explore"
        rightIcon={{
          name: 'search',
          family: ICON_FAMILY_NAME.FontAwesome5,
          onPress: handleSearchPress,
        }}
      />
      <ScrollView className="flex-1 px-4 py-6">
        <Text className="mb-8 text-center text-3xl font-bold text-gray-800">Explore Tab</Text>

        <InteractiveStar animations={animations} />

        <NavigationSuccess />

        <View className="mb-6">
          <Text className="mb-4 text-center text-xl font-semibold text-gray-700">
            ✨ Interactive Feature Cards
          </Text>
          <Text className="mb-4 text-center text-sm text-gray-600">
            Tap the cards below to explore features in detail
          </Text>
          <FeatureShowcase cards={cards} features={featuresData} />
        </View>

        <UserJourneyCard />

        <View className="mt-8 rounded-lg bg-purple-50 p-6">
          <Text className="mb-3 text-lg font-semibold text-purple-800">🎯 What&apos;s Next?</Text>
          <Text className="mb-2 text-purple-700">
            • Add more complex animations and transitions
          </Text>
          <Text className="mb-2 text-purple-700">
            • Implement state management with Zustand or Redux
          </Text>
          <Text className="mb-2 text-purple-700">• Add API integration and data fetching</Text>
          <Text className="text-purple-700">• Create custom hooks and utility functions</Text>
        </View>
      </ScrollView>
    </View>
  )
}

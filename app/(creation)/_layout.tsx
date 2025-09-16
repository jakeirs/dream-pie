import { Stack } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function CreationLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: brandColors.background,
        },
        headerTitleStyle: {
          color: brandColors.textPrimary,
          fontSize: 18,
          fontWeight: '600',
        },
        headerBackTitleVisible: false,
        headerTintColor: brandColors.textPrimary,
      }}>
      <Stack.Screen
        name="generation"
        options={{
          title: 'Creating Your Photo',
          headerLeft: () => null, // Disable back button during generation
          gestureEnabled: false, // Disable swipe back during generation
        }}
      />
      <Stack.Screen
        name="result"
        options={{
          title: 'Your Dream Photo',
          presentation: 'card',
        }}
      />
    </Stack>
  )
}
import { Stack } from 'expo-router'
import { brandColors } from '@/shared/theme'

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: brandColors.background,
        },
      }}>
      <Stack.Screen
        name="onboarding"
        options={{
          title: 'Welcome to Dream Pie',
        }}
      />
      <Stack.Screen
        name="login"
        options={{
          title: 'Get Started',
        }}
      />
    </Stack>
  )
}
import '../global.css'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { Platform } from 'react-native'
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { brandColors } from '@/shared/theme'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export const unstable_settings = {
  anchor: '(auth)',
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync()
  }, [])

  const backgroundColor = brandColors.background // Theme background color

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor }}>
      <SafeAreaProvider style={{ flex: 1, backgroundColor }}>
        <StatusBar style="auto" />
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          mode={Platform.OS === 'ios' ? 'margin' : 'padding'}>
          <BottomSheetModalProvider>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: Platform.OS === 'ios' ? 'default' : 'fade_from_bottom',
              }}>
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="(creation)" options={{ headerShown: false }} />
              <Stack.Screen
                name="settings"
                options={{
                  presentation: 'modal',
                  title: 'Settings',
                  headerShown: false,
                }}
              />
            </Stack>

          </BottomSheetModalProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  )
}

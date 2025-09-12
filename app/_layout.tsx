import '../global.css';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Platform } from 'react-native';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  const backgroundColor = '#f3f4f6'; // Light gray background

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
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="modal"
                options={{
                  presentation: 'modal',
                  title: 'Modal',
                  headerShown: false,
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

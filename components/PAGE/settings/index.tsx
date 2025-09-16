import React from 'react'
import { View, Text, Switch, ScrollView } from 'react-native'
import { useAppStores } from '@/stores'
import { PageHeader, ICON_FAMILY_NAME } from '@/components/ui'
import { router } from 'expo-router'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { brandColors } from '@/shared/theme'

export default function SettingsPage() {
  const { user } = useAppStores()

  const handleBack = () => {
    router.back()
  }

  return (
    <SafeAreaProvider style={{ flex: 1, backgroundColor: brandColors.background }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
        <View className="flex-1 bg-background">
          <PageHeader
            title="Settings"
            leftIcon={{
              name: 'arrow-left',
              family: ICON_FAMILY_NAME.Feather,
              onPress: handleBack
            }}
          />

          <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 32 }}>
            <View className="px-6 pt-6">
              <View className="space-y-6">
        <View className="bg-card rounded-xl p-4">
          <Text className="text-lg font-semibold text-textPrimary mb-4">Preferences</Text>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-textPrimary">Auto-save results</Text>
            <Switch
              value={user.user?.preferences.autoSaveResults}
              onValueChange={(value) =>
                user.updatePreferences({ autoSaveResults: value })
              }
            />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-textPrimary">Push notifications</Text>
            <Switch
              value={user.user?.preferences.allowNotifications}
              onValueChange={(value) =>
                user.updatePreferences({ allowNotifications: value })
              }
            />
          </View>
        </View>

        <View className="bg-card rounded-xl p-4">
          <Text className="text-lg font-semibold text-textPrimary mb-4">Account</Text>
          <Text className="text-textSecondary">
            {user.user?.email}
          </Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}
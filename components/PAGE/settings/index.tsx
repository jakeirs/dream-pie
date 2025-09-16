import React from 'react'
import { View, Text, Switch } from 'react-native'
import { useAppStores } from '@/stores'
import { Button } from '@/components/ui'
import { router } from 'expo-router'

export default function SettingsPage() {
  const { user, navigation } = useAppStores()

  const handleClose = () => {
    navigation.closeBottomSheet('settings')
  }

  return (
    <View className="flex-1 bg-background p-6">
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-2xl font-bold text-textPrimary">Settings</Text>
        <Button variant="secondary" size="small" onPress={handleClose}>
          Done
        </Button>
      </View>

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
  )
}
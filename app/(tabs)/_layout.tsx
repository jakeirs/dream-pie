import { Tabs } from 'expo-router'
import { Icon, ICON_FAMILY_NAME } from '@/components/ui'
import { brandColors } from '@/shared/theme'
import { router } from 'expo-router'

export default function TabLayout() {
  const handleSettingsPress = () => {
    router.push('/settings')
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: brandColors.primary,
        tabBarInactiveTintColor: brandColors.textMuted,
        tabBarStyle: {
          backgroundColor: brandColors.card,
          borderTopColor: brandColors.borderLight,
          height: 70,
          paddingBottom: 8,
          paddingTop: 8,
        },
        headerShown: true,
        headerStyle: {
          backgroundColor: brandColors.background,
          borderBottomColor: brandColors.borderLight,
        },
        headerTitleStyle: {
          color: brandColors.textPrimary,
          fontSize: 18,
          fontWeight: 'bold',
        },
        headerRight: () => (
          <Icon
            family={ICON_FAMILY_NAME.Feather}
            name="settings"
            size={24}
            color={brandColors.textPrimary}
            onPress={handleSettingsPress}
            style={{ marginRight: 16 }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          headerTitle: 'Dream Pie',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="camera" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          headerTitle: 'My Gallery',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="grid" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

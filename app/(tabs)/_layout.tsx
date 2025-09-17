import { Tabs } from 'expo-router'
import { Icon } from '@/components/ui/icons/Icon'
import { ICON_FAMILY_NAME } from '@/components/ui/icons/constants'
import { brandColors } from '@/shared/theme'

export default function TabLayout() {
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
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Create',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="camera" size={26} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="gallery"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="grid" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}

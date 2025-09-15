import { Tabs } from 'expo-router';
import { Icon, ICON_FAMILY_NAME } from '@/components/ui';
import { brandColors } from '@/shared/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: brandColors.primary,
        tabBarInactiveTintColor: brandColors.textMuted,
        tabBarStyle: {
          backgroundColor: brandColors.primaryForeground,
          borderTopColor: brandColors.borderLight,
          height: 60,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon family={ICON_FAMILY_NAME.Feather} name="compass" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

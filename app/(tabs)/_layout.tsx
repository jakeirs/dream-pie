import { Tabs } from 'expo-router';
import { Icon, ICON_FAMILY_NAME } from '@/components/ui';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#E5E7EB',
          height: 60,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="home"
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Icon
              family={ICON_FAMILY_NAME.Feather}
              name="compass"
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}

import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { useMedia } from '@/hooks/use-media';
import { NAV_THEME } from '@/lib/theme';
import { Tabs } from 'expo-router';
import { HomeIcon, PlusCircleIcon, CompassIcon, UserIcon, ListIcon } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';

const TAB_OPTIONS = {
  tabBarActiveTintColor: NAV_THEME.light.colors.primary,
  tabBarInactiveTintColor: '#9ca3af',
  tabBarStyle: {
    borderTopWidth: 0,
    elevation: 12,
    shadowOpacity: 0.1,
    paddingBottom: 4,
    paddingTop: 4,
    height: 64,
  },
  headerShown: false,
};

export default function TabsLayout() {
  const { colorScheme } = useColorScheme();
  const { stats } = useMedia();

  return (
    <Tabs
      screenOptions={{
        ...TAB_OPTIONS,
        tabBarActiveTintColor: NAV_THEME[colorScheme ?? 'light'].colors.primary,
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Icon as={HomeIcon} className="size-5" color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Discover',
          tabBarIcon: ({ color }) => <Icon as={CompassIcon} className="size-5" color={color} />,
        }}
      />
      <Tabs.Screen
        name="my-list"
        options={{
          title: 'My Lists',
          tabBarIcon: ({ color }) => <Icon as={ListIcon} className="size-5" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon as={UserIcon} className="size-5" color={color} />,
          tabBarBadge: stats.completed > 50 ? '★' : undefined,
        }}
      />
      <Tabs.Screen
        name="add-entry"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="library"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { MediaProvider } from '@/providers/media-provider';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <MediaProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="media/[id]" options={{ presentation: 'card', headerShown: true }} />
          <Stack.Screen name="calendar" options={{ presentation: 'card', headerShown: false }} />
          <Stack.Screen name="settings" options={{ presentation: 'card', headerShown: true, title: 'Settings' }} />
        </Stack>
        <PortalHost />
      </MediaProvider>
    </ThemeProvider>
  );
}

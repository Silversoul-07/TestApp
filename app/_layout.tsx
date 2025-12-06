// TODO: Transition UI improvements:
// - Add smooth page transitions with React Navigation animations
// - Implement shared element transitions for media cards
// - Add fade/slide animations between screens
// - Improve modal presentation animations
// - Add gesture-based navigation with spring physics
// - Consider using Reanimated for performance-optimized transitions

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
        <Stack 
          screenOptions={{ 
            headerShown: false,
            gestureEnabled: true,
            contentStyle: {
              backgroundColor: NAV_THEME[colorScheme ?? 'light'].colors.background,
            },
          }}>
          <Stack.Screen 
            name="(tabs)" 
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen 
            name="media/[id]" 
            options={{ 
              presentation: 'card',
              headerShown: true,
              gestureEnabled: true,
            }} 
          />
        </Stack>
        <PortalHost />
      </MediaProvider>
    </ThemeProvider>
  );
}

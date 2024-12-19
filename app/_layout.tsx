import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components'
import 'react-native-reanimated';

import { useColorScheme } from '@/lib/hooks/useColorScheme';
import useSession from '@/lib/hooks/auth/useSession';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { IonIconsPack } from '@/lib/components/IonIcon';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { session } = useSession();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || session !== undefined) {
      SplashScreen.hideAsync();
    }

    if (session === null && loaded) {
      router.replace("/(auth)/sign-in")
    }
  }, [loaded, session]);

  if (!loaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <IconRegistry icons={[IonIconsPack]} />
      <ApplicationProvider {...eva} theme={colorScheme === "dark" ? eva.dark : eva.light}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(app)/(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(app)/me" options={{ 
              presentation: "fullScreenModal",
              animation: "slide_from_bottom"
            }} />
            <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ApplicationProvider>
    </QueryClientProvider>
  );
}

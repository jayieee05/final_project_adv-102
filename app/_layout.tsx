import {
  CormorantGaramond_400Regular,
  CormorantGaramond_600SemiBold,
  useFonts,
} from '@expo-google-fonts/cormorant-garamond';
import { Montserrat_300Light, Montserrat_400Regular, Montserrat_500Medium } from '@expo-google-fonts/montserrat';
import { ThemeProvider, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { FinesseColors } from '@/constants/finesse-theme';
import { AuthProvider } from '@/contexts/auth-context';
import { CartProvider } from '@/contexts/cart-context';

SplashScreen.preventAutoHideAsync();

const FinesseLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: FinesseColors.primary,
    background: FinesseColors.background,
    card: FinesseColors.background,
    text: FinesseColors.text,
    border: FinesseColors.border,
    notification: FinesseColors.primaryDark,
  },
};

const FinesseDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: FinesseColors.primary,
    background: FinesseColors.secondary,
    card: FinesseColors.secondary,
    text: FinesseColors.background,
    border: FinesseColors.border,
    notification: FinesseColors.primaryLight,
  },
};

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontsLoaded, fontError] = useFonts({
    CormorantGaramond_400Regular,
    CormorantGaramond_600SemiBold,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const theme = colorScheme === 'dark' ? FinesseDarkTheme : FinesseLightTheme;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <AuthProvider>
            <CartProvider>
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: FinesseColors.background } }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="product/[id]" />
                <Stack.Screen name="login" />
                <Stack.Screen name="signup" />
                <Stack.Screen name="cart" options={{ presentation: 'modal' }} />
                <Stack.Screen name="dashboard" />
              </Stack>
              <StatusBar style="dark" />
            </CartProvider>
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

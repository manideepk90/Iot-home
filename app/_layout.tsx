import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { View, StyleSheet } from 'react-native';

import { useColorScheme } from '@/hooks/useColorScheme';
import { AppStateProvider } from './context/appState';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });


  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AppStateProvider>
        <View style={styles.container}>
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{
                statusBarStyle: colorScheme === 'dark' ? 'light' : 'dark',
                headerShown: false, statusBarHidden: false
              }} />
              <Stack.Screen name="ConnectedPage" options={{
                statusBarStyle: colorScheme === 'dark' ? 'light' : 'dark',
                headerShown: false, statusBarHidden: false
              }} />
              <Stack.Screen name="settings" options={{
                statusBarStyle: colorScheme === 'dark' ? 'light' : 'dark',
                headerShown: false, statusBarHidden: false
              }} />
              <Stack.Screen name="+not-found" />
            </Stack>
          </View>
        </View>
        <StatusBar style={
          colorScheme === 'dark' ? 'light' : 'dark'
        } />
      </AppStateProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  }
});

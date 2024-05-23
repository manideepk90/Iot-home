import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DatabaseProvider from "../hooks/useDatabase";
import DevicesProvider from "../hooks/useDiscoveryContext";
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    "ElMessiri-Bold": require("../assets/fonts/ElMessiri-Bold.ttf"),
    "ElMessiri-SemiBold": require("../assets/fonts/ElMessiri-SemiBold.ttf"),
    "ElMessiri-Regular": require("../assets/fonts/ElMessiri-Regular.ttf"),
    "ElMessiri-Medium": require("../assets/fonts/ElMessiri-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
    if (error) throw error;
  }, [loaded, error]);

  if (!loaded || error) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <DevicesProvider>
          <Stack>
            <Stack.Screen
              name="index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="Connecting"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="(home)/home"
              options={{
                headerShown: false,
              }}
            />
          </Stack>
        </DevicesProvider>
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}

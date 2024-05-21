import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Stack } from "expo-router";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // "DMSans-Black": require("../assets/fonts/DMSans-Black.ttf"),
    // "DMSans-Bold": require("../assets/fonts/DMSans-Bold.ttf"),
    // "DMSans-Italic": require("../assets/fonts/DMSans-Italic.ttf"),
    // "DMSans-Regular": require("../assets/fonts/DMSans-Regular.ttf"),
    // "DMSans-Medium": require("../assets/fonts/DMSans-Medium.ttf"),
    // "DMSans-Light": require("../assets/fonts/DMSans-Light.ttf"),
    // "DMSans-ExtraBold": require("../assets/fonts/DMSans-ExtraBold.ttf"),
    // "DMSans-ExtraLight": require("../assets/fonts/DMSans-ExtraLight.ttf"),
    // "DMSans-Thin": require("../assets/fonts/DMSans-Thin.ttf"),
    // "DMSans-SemiBold": require("../assets/fonts/DMSans-SemiBold.ttf"),
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
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </SafeAreaProvider>
  );
}

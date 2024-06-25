import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "@/constants/Colors";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.light.darkbackground,
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  connectionText: {
    fontFamily: "ElMessiri-Bold",
    color: Colors.light.background,
    fontSize: 18,
  },
});
const ConnectingScreen = () => {
  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <Text style={[styles.connectionText, { fontSize: 26 }]}>
          Please wait
        </Text>
        <Text style={styles.connectionText}>Connecting...</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default ConnectingScreen;



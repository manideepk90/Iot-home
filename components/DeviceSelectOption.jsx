import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { HomeIcon } from "@/constants/icons";
import { Image } from "expo-image";

const DeviceSelectOption = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logoIcon} source={HomeIcon} />
      <Text style={styles.titleText}>Smart Home</Text>
    </View>
  );
};

export default DeviceSelectOption;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    textAlign: "center",
  },
  logoIcon: {
    width: 50,
    height: 50,
    transform: [{ scale: 2 }],
  },
  titleText: {
    fontSize: 20,
    fontFamily: "ElMessiri-Bold",
    textAlign: "middle",
  },
});

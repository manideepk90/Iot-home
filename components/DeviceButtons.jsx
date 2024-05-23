import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushButton from "./Buttons/PushButton";
const DeviceButtons = () => {
  return (
    <View style={styles.container}>
      <PushButton />
      <PushButton />
      <PushButton />
      <PushButton />
      <PushButton />
      <PushButton />
      <PushButton />
      <PushButton />
    </View>
  );
};

export default DeviceButtons;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
    padding: 35,
    borderRadius: 21,
    gap: 10,
  },
});

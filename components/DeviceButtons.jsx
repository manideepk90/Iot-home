import { StyleSheet, Text, View } from "react-native";
import React from "react";
import PushButton from "./Buttons/PushButton";
import { pushButtonsData } from "@/constants/ButtonsData";
const DeviceButtons = () => {
  return (
    <View style={styles.container}>
      {pushButtonsData.map((button) => (
        <PushButton {...button} key={button.label} />
      ))}
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

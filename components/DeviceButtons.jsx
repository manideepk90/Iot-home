import { StyleSheet, Text, View } from "react-native";
import React, { useContext, useState } from "react";
import PushButton from "./Buttons/PushButton";
import { pushButtonsData } from "@/constants/ButtonsData";
import { DeviceContext } from "@/hooks/useDiscoveryContext";
const DeviceButtons = () => {
  const { state, changeState } = useContext(DeviceContext);

  return (
    <View style={styles.container}>
      {pushButtonsData.map((button) => (
        <PushButton
          {...button}
          key={button.key}
          value={state[button.key]}
          callback={changeState}
        />
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

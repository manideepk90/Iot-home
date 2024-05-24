import { StyleSheet, Text, TouchableOpacity } from "react-native";
import React, { useContext } from "react";
import { Image } from "expo-image";
import { CoolerIcon } from "@/constants/icons";
import { DeviceContext } from "@/hooks/useDiscoveryContext";
import { router } from "expo-router";
const DeviceDetails = () => {
  const { isConnected, selectedDevice: device } = useContext(DeviceContext);

  return (
    <TouchableOpacity
      onPress={() => {
        router.push("/deviceDetails");
      }}
      style={styles.container}
    >
      <Image style={styles.image} source={CoolerIcon} />
      <Text style={styles.name}>{device?.name ?? "Loading..."}</Text>
      <Text style={styles.idText}>{device?.id ?? "Loading..."}</Text>
      <Text style={styles.connectionStatusText}>
        {isConnected ? "Connected" : "Disconnected"}
      </Text>
    </TouchableOpacity>
  );
};

export default DeviceDetails;

const styles = StyleSheet.create({
  container: {
    width: "80%",
    padding: 30,
    maxWidth: 300,
    minWidth: 200,
    // height: 250
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#26D4B5",
    borderRadius: 21,
    gap: 10,
  },
  image: {
    width: 60,
    height: 60,
  },
  idText: {
    fontSize: 16,
    color: "black",
    fontFamily: "ElMessiri-Regular",
  },
  name: {
    fontSize: 22,
    color: "black",
    fontFamily: "ElMessiri-Regular",
  },
  connectionStatusText: {
    fontSize: 18,
    color: "black",
    fontFamily: "ElMessiri-Regular",
  },
});

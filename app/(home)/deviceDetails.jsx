import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useContext } from "react";
import { DeviceContext } from "./../../hooks/useDiscoveryContext";
import { CoolerIcon } from "./../../constants/icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
const deviceDetails = () => {
  const {
    selectedDevice: device,
    isConnected,
    removeDevice,
  } = useContext(DeviceContext);
  const insets = useSafeAreaInsets();
  const styles = StyleSheet.create({
    container: {
      width: "100%",
      paddingTop: insets.top,
      justifyContent: "center",
      alignItems: "center",
      gap: 10,
    },
    container2: {
      width: "100%",
      padding: 30,
      maxWidth: 300,
      minWidth: 200,
      // height: 250
      justifyContent: "start",
      alignItems: "start",
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
    closeButton: {
      backgroundColor: "#26D4B5",
      alignSelf: "flex-end",
      width: 50,
      height: 50,
      borderRadius: 25,
      margin: 10,
      marginRight: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    removeButton: {
      backgroundColor: "rgba(255, 0, 0, 0.8)",
      width: 200,
      height: 50,
      borderRadius: 25,
      color: "white",
      justifyContent: "center",
      alignItems: "center",
    },
    removeText: {
      fontSize: 18,
      color: "white",
      fontFamily: "ElMessiri-Regular",
    },
  });
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        style={styles.closeButton}
      >
        <Text
          style={{
            fontSize: 20,
            color: "black",
            fontFamily: "ElMessiri-Regular",
          }}
        >
          X
        </Text>
      </TouchableOpacity>
      <View style={styles.container2}>
        <Image style={styles.image} source={CoolerIcon} />
        <Text style={styles.name}>name : {device?.name ?? "Loading..."}</Text>
        <Text style={styles.idText}>ID : {device?.id ?? "Loading..."}</Text>
        <Text style={styles.idText}>
          Manufacturer : {device?.deviceOwner ?? "Loading..."}
        </Text>
        <Text style={styles.connectionStatusText}>
          Status : {isConnected ? "Connected" : "Disconnected"}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => removeDevice()}
      >
        <Text style={styles.removeText}>Remove Device</Text>
      </TouchableOpacity>
    </View>
  );
};

export default deviceDetails;

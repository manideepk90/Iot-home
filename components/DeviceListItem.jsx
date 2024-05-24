import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useContext } from "react";
import { Image } from "expo-image";
import { CoolerIcon, ConnectionWifiIcon } from "@/constants/icons";
import { DeviceContext } from "@/hooks/useDiscoveryContext";
const DeviceListItem = ({ item }) => {
  const { connectDevice } = useContext(DeviceContext);
  return (
    <View style={styles.container}>
      <Pressable
        style={styles.buttonContainer}
        onPress={() => {
          connectDevice(item);
        }}
      >
        <View style={styles.iconContainer}>
          <Image source={CoolerIcon} style={styles.iconImage} />
        </View>
        <Image source={ConnectionWifiIcon} style={styles.connectionIcon} />
      </Pressable>
      <Text>{`${item?.name}`.slice(0, 12)}...</Text>
    </View>
  );
};

export default DeviceListItem;

const styles = StyleSheet.create({
  container: {
    width: 100,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    textAlign: "center",
    position: "relative",
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  connectionIcon: {
    width: 24,
    height: 24,
    position: "absolute",
    right: -6,
    bottom: 0,
    borderRadius: 12,
  },

  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    backgroundColor: "#07D99A",
    borderColor: "rgba(255, 255, 255, 0.125)",
    filter: "blur(0.25px)",
    backdropFilter: "blur(9.5px)",
  },
  iconImage: {
    width: 50,
    height: 50,
  },
});

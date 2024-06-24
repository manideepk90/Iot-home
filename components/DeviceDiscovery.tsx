import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import ContentricCircles from "./ContentricCircles";
import DevicesList from "./DevicesList";
import { DeviceContext } from "../hooks/useDiscoveryContext";
const DeviceDiscovery = () => {
  const { discoverDevices, ip, error } = React.useContext(DeviceContext);

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <DevicesList />
        <Text>{ip}</Text>
        <Text>{error}</Text>
        <ContentricCircles>
          <TouchableOpacity
            style={styles.scanButton}
            onPress={() => {
              discoverDevices();
            }}
          >
            <Text style={styles.buttonText}>searching</Text>
          </TouchableOpacity>
        </ContentricCircles>
      </View>
    </View>
  );
};

export default DeviceDiscovery;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    color: "#000",
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
  },
  container2: {
    position: "relative",
    height: "80%",
    width: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  scanButton: {
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    borderWidth: 1,
    borderBottomWidth: 0,
    paddingTop: 40,
    paddingBottom: 0,
    paddingLeft: 30,
    width: 160,
    minWidth: 160,
    alignItems: "center",
    alignSelf: "flex-end",
    paddingRight: 30,
    backgroundColor: "#00FFD4",
    borderColor: "#00FFD4",
    height: 90,
  },
  buttonText: {
    fontSize: 22,
    fontFamily: "ElMessiri-Bold",
    color: "#000",
  },
});

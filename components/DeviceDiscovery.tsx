import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import ContentricCircles from "./ContentricCircles";
import DevicesList from "./DevicesList";
const DeviceDiscovery = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <DevicesList />
        <ContentricCircles>
          <TouchableOpacity style={styles.scanButton} onPress={() => {}}>
            <Text style={styles.buttonText}>Scan</Text>
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
    flex: 1,
    color: "#000",
    position: "absolute",
    bottom: 0,
    left: 0,
    justifyContent: "flex-end",
  },
  container2: {
    position: "relative",
    height: "70%",
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
    fontSize: 26,
    fontFamily: "ElMessiri-Bold",
    color: "#000",
  },
});

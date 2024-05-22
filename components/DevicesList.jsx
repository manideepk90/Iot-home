import { StyleSheet, View } from "react-native";
import React, { useContext } from "react";
import DeviceListItem from "./DeviceListItem";
import { DeviceContext } from "../hooks/useDiscoveryContext";
const DevicesList = () => {
  const { devices } = useContext(DeviceContext);
  return (
    <View style={styles.container}>
      {devices.map((item, index) => (
        <DeviceListItem item={item} key={item?.ip} />
      ))}
    </View>
  );
};

export default DevicesList;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "center",
    paddingBottom: 110,
    width: "100%",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 30,
    padding: 10,
  },
});

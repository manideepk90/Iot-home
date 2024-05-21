import { Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import DeviceListItem from "./DeviceListItem";
import * as Network from "expo-network";
import axios from "axios";
const DevicesList = () => {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);
  const [ip, setIp] = useState("Ip Address:");

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        // const granted = await PermissionsAndroid.requestMultiple(
        //   [
        //     PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        //     PermissionsAndroid.PERMISSIONS.ACCESS_WIFI_STATE,
        //     PermissionsAndroid.PERMISSIONS.CHANGE_WIFI_STATE,
        //   ],
        //   {
        //     title: "Location Permission",
        //     message:
        //       "We need your permission to access your location and Wi-Fi information to improve your experience.",
        //   }
        // );
        // if (
        //   granted["android.permission.ACCESS_FINE_LOCATION"] ===
        //     PermissionsAndroid.RESULTS.GRANTED &&
        //   granted["android.permission.ACCESS_WIFI_STATE"] ===
        //     PermissionsAndroid.RESULTS.GRANTED &&
        //   granted["android.permission.CHANGE_WIFI_STATE"] ===
        //     PermissionsAndroid.RESULTS.GRANTED
        // ) {
        //   console.log("You can use the permissions");
        // } else {
        //   console.log("Permissions denied");
        // }
      } catch (err) {
        console.warn(err);
      }
    }
  };
  const discoverIp = async () => {
    const localIp = await Network.getIpAddressAsync();
    setIp(localIp);
  };

  const discoverDevices = async () => {
    setScanning(true);
    const localIp = await Network.getIpAddressAsync();
    const ipPrefix = localIp.substring(0, localIp.lastIndexOf(".") + 1);
    setIp("My IP: " + localIp);
    const devicePromises = [];
    for (let i = 0; i <= 255; i++) {
      const ip = `${ipPrefix}${i}`;
      devicePromises.push(pingDevice(ip));
    }

    const deviceResults = await Promise.all(devicePromises);

    const discoveredDevices = deviceResults.filter((device) => device !== null);
    setDevices(() => discoveredDevices);
    setScanning(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      discoverDevices();
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const pingDevice = async (ip) => {
    try {
      const response = await axios.get(`http://${ip}/details`, {
        timeout: 1000,
      });
      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      // Device is not responding
    }
    return null;
  };
  useEffect(() => {
    requestPermissions();
    discoverIp();
  }, []);

  return (
    <View style={styles.container}>
      {/* <Text>{ip}</Text> */}
      {devices.map((item, index) => (
        <DeviceListItem item={item} key={item?.ip} />
      ))}
      {/* <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem />
      <DeviceListItem /> */}
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

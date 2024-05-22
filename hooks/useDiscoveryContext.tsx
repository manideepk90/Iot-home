import { StyleSheet, Text, View } from "react-native";
import React, { ReactNode, createContext, useContext, useEffect } from "react";
import axios from "axios";
import * as Network from "expo-network";
import { DatabaseContext } from "./useDatabase";
import { router } from "expo-router";
export const DeviceContext = createContext({
  devices: [],
  scanning: false,
} as any);

const pingDevice = async (ip: string) => {
  try {
    const response = await axios.get(`http://${ip}/details`, {
      timeout: 1000,
    });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {}
  return null;
};

const DevicesProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = React.useState([]);
  const [scanning, setScanning] = React.useState(false);
  const [connecting, setConnecting] = React.useState(false);
  const [isConnected, setConnected] = React.useState(false);
  const [selectedDevice, setSelectedDevice] = React.useState({} as any);
  const { devicesActions, selectedDeviceActions }: any =
    useContext(DatabaseContext);
  const [error, setError] = React.useState("");
  const [ip, setIp] = React.useState("");
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

    const discoveredDevices: any = deviceResults.filter(
      (device) => device !== null
    );
    setDevices(() => discoveredDevices);
    setScanning(false);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      discoverDevices();
    }, 6000);
    return () => clearInterval(interval);
  }, []);
  const getSelectedDevice = async (link = false) => {
    const device = await selectedDeviceActions.getSelectedDevice();
    if (link && device.status) {
      router.replace("/home");
    }
    return device.data;
  };

  useEffect(() => {
    discoverIp();
    const fetchDevice = async () => {
      const device = await getSelectedDevice();
      if (device) {
        setSelectedDevice(device);
        connect(device);
      }
    };
    fetchDevice();
  }, []);

  const connect = async (device: any) => {
    setConnecting(true);
    try {
      if (!device.ip) return { error: "No IP address" };
      const response = await axios.get(`http://${device.ip}/details`);
      if (response.status === 200) {
        if (response.data) {
          const result2 = await selectedDeviceActions.setSelectedDevice(device);
          if (result2.status && !result2.dbError) {
            setConnecting(false);
            setConnected(true);
          } else {
            setError("Failed to connect device");
            setConnected(false);
          }
        }
      }
    } catch (error) {
      console.log(error);
      setConnected(false);
    }
  };

  const connectDevice = async (device: any) => {
    setConnecting(true);
    router.replace("/connecting");
    try {
      if (!device.ip) return { error: "No IP address" };
      const response = await axios.get(`http://${device.ip}/details`);
      if (response.status === 200) {
        if (response.data) {
          const result = await devicesActions.addDevice(device);
          const result2 = await selectedDeviceActions.setSelectedDevice(device);
          if (
            result.status &&
            !result.dbError &&
            result2.status &&
            !result2.dbError
          ) {
            router.replace("/");
            router.push("/home");
            setConnecting(false);
          } else {
            setError("Error adding device");
            router.replace("/");
          }
        }
      }
    } catch (error) {
      console.log(error);
      router.replace("/");
    }
  };

  useEffect(() => {}, [selectedDevice]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        scanning,
        discoverDevices,
        connectDevice,
        connecting,
        selectedDevice,
        getSelectedDevice,
        connect,
        isConnected,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DevicesProvider;

const styles = StyleSheet.create({});

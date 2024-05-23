import { StyleSheet } from "react-native";
import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";
import * as Network from "expo-network";
import { DatabaseContext } from "./useDatabase";
import { router } from "expo-router";

export const DeviceContext = createContext({
  devices: [],
  scanning: false,
  discoverDevices: () => {},
  connectDevice: (device: any) => {},
  connecting: false,
  selectedDevice: null,
  getSelectedDevice: (link?: boolean) => {},
  connect: (device: any) => {},
  isConnected: false,
  discoverDeviceById: (id: string) => {},
} as any);

const pingDevice = async (ip: string) => {
  try {
    const response = await axios.get(`http://${ip}/details`, { timeout: 1000 });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return false;
    // console.error(`Error pinging device at ${ip}: `, error);
  }
  return null;
};

const DevicesProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState([] as any[]);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const { devicesActions, selectedDeviceActions } = useContext(
    DatabaseContext
  ) as any;
  const [error, setError] = useState("");
  const [ip, setIp] = useState("");

  const discoverIp = async () => {
    const localIp = await Network.getIpAddressAsync();
    setIp(localIp);
  };

  const discoverDevices = useCallback(async () => {
    setScanning(true);
    const localIp = await Network.getIpAddressAsync();
    const ipPrefix = localIp.substring(0, localIp.lastIndexOf(".") + 1);

    const devicePromises = [];
    for (let i = 0; i <= 255; i++) {
      const ip = `${ipPrefix}${i}`;
      devicePromises.push(pingDevice(ip));
    }

    const deviceResults = await Promise.all(devicePromises);
    const discoveredDevices = deviceResults.filter((device) => device !== null);

    setDevices(discoveredDevices);
    setScanning(false);
  }, []);

  useEffect(() => {
    discoverIp();
    discoverDevices();

    const interval = setInterval(discoverDevices, 6000);
    return () => clearInterval(interval);
  }, [discoverDevices, selectedDevice]);

  const getSelectedDevice = useCallback(
    async (link = false) => {
      const device = await selectedDeviceActions.getSelectedDevice();
      if (link && device.status) {
        router.replace("/home");
      }
      return device.data;
    },
    [selectedDeviceActions]
  );

  useEffect(() => {
    const fetchDevice = async () => {
      const device = await getSelectedDevice();
      if (device) {
        setSelectedDevice(device);
        await connect(device);
      }
    };
    fetchDevice();
  }, [getSelectedDevice]);

  const discoverDeviceById = async (id: string) => {
    const device = devices.find((device) => device.id === id);
    console.log("looking for device: ", device);
    if (device) {
      setSelectedDevice(device);
      await connect(device);
    }
  };

  const connect = useCallback(
    async (device: any) => {
      if (!device.ip || connecting) {
        console.log("No IP address or already connecting");
        return false;
      }
      setConnecting(true);
      try {
        const response = await pingDevice(device.ip);
        if (response) {
          const result = await selectedDeviceActions.setSelectedDevice(
            response
          );
          if (result.status && !result.dbError) {
            console.log("Connecting to device: ", device, connecting);
            setConnected(true);
            return true;
          }
        }
        discoverDeviceById(device.id);
        setConnected(false);
        setError("Failed to connect device");
      } catch (error) {
        setConnected(false);
        setError("Failed to connect device");
      } finally {
        setConnecting(false);
      }
      return false;
    },
    [connecting, selectedDeviceActions]
  );

  const connectDevice = async (device: any) => {
    setConnecting(true);
    router.replace("/connecting");
    try {
      if (!device.ip) throw new Error("No IP address");
      const response = await axios.get(`http://${device.ip}/details`);
      if (response.status === 200 && response.data) {
        const result = await devicesActions.addDevice(device);
        const result2 = await selectedDeviceActions.setSelectedDevice(device);
        if (
          result.status &&
          !result.dbError &&
          result2.status &&
          !result2.dbError
        ) {
          router.replace("/home");
          setConnecting(false);
          return;
        }
      }
      setError("Error adding device");
    } catch (error: any) {
      console.error("Error adding device: ", error);
      setError(error.message);
    } finally {
      setConnecting(false);
      router.replace("/");
    }
  };

  useEffect(() => {
    if (selectedDevice || !connecting) {
      const interval = setInterval(() => {
        connect(selectedDevice);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [selectedDevice, connect, connecting]);

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

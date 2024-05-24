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
  changeState: (state: any) => {},
} as any);

const pingDevice = async (ip: string) => {
  try {
    const response = await axios.get(`http://${ip}/details`, { timeout: 1000 });
    if (response.status === 200) {
      return response.data;
    }
  } catch (error) {
    return false;
  }
  return null;
};

const DevicesProvider = ({ children }: { children: ReactNode }) => {
  const [devices, setDevices] = useState([] as any[]);
  const [scanning, setScanning] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [state, setState] = useState({
    coolState: 0,
    coolerState: 0,
    swingState: 0,
  });
  const [selectedDevice, setSelectedDevice] = useState(null as any);
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
    const discoveredDevices = deviceResults.filter(
      (device) => device !== null && device
    );
    setDevices(discoveredDevices);
    setScanning(false);
  }, []);

  useEffect(() => {
    discoverIp();
    discoverDevices();
    if (scanning || connecting) return;
    const interval = setInterval(discoverDevices, 7000);
    return () => clearInterval(interval);
  }, [discoverDevices, selectedDevice, scanning, connecting]);

  const getSelectedDevice = useCallback(
    async (link = false) => {
      const device = await selectedDeviceActions.getSelectedDevice();
      if (device.status && device.data) {
        if (link) {
          router.replace("/home");
        }
        return device.data;
      }
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

  const discoverDeviceById = useCallback(
    async (id: string) => {
      const device = devices.find((device) => device.id === id);
      console.log("looking for device: ", device);
      if (device) {
        setSelectedDevice(device);
        await connect(device);
      }
    },
    [devices]
  );

  const connect = useCallback(
    async (device: any) => {
      if (!device.ip) {
        return false;
      }
      setConnecting(true);
      try {
        const response = await pingDevice(device.ip);
        if (response) {
          setConnected(true);
          return true;
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
          setConnecting(false);
          setConnected(true);
          router.replace("/home");
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

  // useEffect(() => {
  //   if (selectedDevice || !connecting) {
  //     const interval = setInterval(() => {
  //       connect(selectedDevice);
  //     }, 6000);
  //     return () => clearInterval(interval);
  //   }
  // }, [selectedDevice, connect, connecting]);
  function debounce(func: any, wait: number) {
    let timeout: any;
    return function (...args: any) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const changeState = async (newState: any) => {
    setState((prevState: any) => ({ ...prevState, ...newState }));

    try {
      console.log("changing state: ", newState);
      const response = await axios.post(
        `http://${selectedDevice.ip}/setCoolerState`,
        newState,
        {
          timeout: 2500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        setConnected(true);
        setState(response.data);
      } else {
        // Handle error response
        setConnected(false);
      }
    } catch (error) {
      console.error("Error changing state: ", error);
      setConnected(false);
    }
  };
  const debouncedChangeState = useCallback(debounce(changeState, 300), [
    selectedDevice,
  ]);

  return (
    <DeviceContext.Provider
      value={{
        devices,
        ip,
        scanning,
        discoverDevices,
        connectDevice,
        connecting,
        selectedDevice,
        getSelectedDevice,
        connect,
        isConnected,
        state,
        changeState: debouncedChangeState,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DevicesProvider;

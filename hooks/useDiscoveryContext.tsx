import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";
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
  removeDevice: (device: any) => {},
} as any);

const pingDevice = async (ip: string) => {
  try {
    const response = await axios.get(`http://${ip}:4000/details`, {
      timeout: 1000,
    });
    console.log(response);
    if (response.status === 200) {
      return response.data;
    }
  } catch (error: AxiosError | any) {
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
    setError("");
    console.log("Discovering devices on network", ip);

    const ipPrefix = ip.substring(0, ip.lastIndexOf(".") + 1);
    const devicePromises = [];
    for (let i = 0; i <= 255; i++) {
      const ip = `${ipPrefix}${i}`;
      devicePromises.push(pingDevice(ip));
    }
    const remainingResults = await Promise.all(devicePromises);
    const deviceResults = [...remainingResults];

    const discoveredDevices = deviceResults.filter(
      (device) => device !== null && device
    );
    console.log("Discovered devices:", discoveredDevices);

    if (discoveredDevices.length === 0) {
      setError("No devices found");
    }

    setDevices(() => discoveredDevices);
    setScanning(false);
  }, [ip, scanning]);

  useEffect(() => {
    if (ip !== "" || ip !== null || ip !== "0.0.0.0") {
      discoverDevices();
    }
  }, [ip]);

  useEffect(() => {
    if (ip === "" || ip === null || ip === "0.0.0.0") {
      discoverIp();
    }
    if (scanning || connecting || selectedDevice) {
      return;
    }
    const interval = setInterval(() => {
      discoverDevices();
    }, 6000);
    return () => clearInterval(interval);
  }, [discoverDevices, selectedDevice, scanning, connecting, ip, devices]);

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
      console.log("looking for device with id :", id);
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
        } else {
          discoverDevices();
          discoverDeviceById(device.id);
        }
        setConnected(false);
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
      const response = await axios.get(`http://${device.ip}:4000/details`);
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
        `http://${selectedDevice.ip}:4000/setCoolerState`,
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
  const debouncedChangeState = useCallback(debounce(changeState, 100), [
    selectedDevice,
  ]);

  const removeDevice = async (id: string) => {
    const result = await devicesActions.removeDevice(id);
    if (result.status && !result.dbError) {
      setSelectedDevice(null);
      setConnected(false);
      router.replace("/");
    }
  };

  return (
    <DeviceContext.Provider
      value={{
        devices,
        ip,
        error,
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
        removeDevice,
      }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export default DevicesProvider;

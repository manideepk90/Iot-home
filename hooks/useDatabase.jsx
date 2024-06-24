import { createContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
export const DatabaseContext = createContext(null);

const storage = new Storage({
  storageBackend: AsyncStorage,
  defaultExpires: null,
  enableCache: true,
  sync: {},
});

const useDatabase = ({ children }) => {
  const storeData = async (key, data) => {
    try {
      return await storage.save({
        key: key,
        data,
        expires: null,
      });
    } catch (e) {
      return { dbError: true, msg: "failed to store the data" };
    }
  };
  const getData = async (key) => {
    try {
      return await storage.load({
        key: key,
      });
    } catch (e) {
      return { dbError: true, msg: "failed to get the data" };
    }
  };
  const initDb = async () => {
    if ((await getData("devices"))?.dbError) {
      await storeData("devices", []);
    }
    if ((await getData("selectedDevice"))?.dbError) {
      await storeData("selectedDevice", null);
    }
  };

  useEffect(() => {
    initDb();
  }, []);

  const resetStorage = async () => {
    return await storage?.clearMap();
  };

  const addDevice = async (device) => {
    if (device.id) {
      const devices = await getData("devices");
      if (devices?.dbError) {
        console.log(devices?.dbError);
        return { dbError: true, msg: "failed to add the data" };
      } else {
        const newDevices = devices.some((d) => d?.id === device?.id)
          ? devices.map((d) => (d.id === device.id ? device : d))
          : [...devices, device];
        await storeData("devices", newDevices);
        return { status: true, data: await getData("devices") };
      }
    }
  };

  const removeDevice = async (device) => {
    const devices = await getData("devices");
    if (devices?.dbError) {
      return { dbError: true, msg: "failed to get the data" };
    } else {
      const newDevices = devices.filter((d) => d?.id !== device?.id);
      return await storeData("devices", newDevices);
    }
  };

  const updateDevice = async (device) => {
    const devices = await getData("devices");
    if (devices?.dbError) {
      return { dbError: true, msg: "failed to get the data" };
    } else {
      const newDevices = devices.map((d) =>
        d?.id === device?.id ? device : d
      );
      return await storeData("devices", newDevices);
    }
  };

  const clearDevices = async () => {
    return await storeData("devices", []);
  };

  const getDevices = async () => {
    return await getData("devices");
  };

  const getDevice = async (id) => {
    const devices = await getData("devices");
    if (devices?.dbError) {
      return { dbError: true, msg: "failed to get the data" };
    } else {
      return devices.find((d) => d?.id === id);
    }
  };

  const setSelectedDevice = async (device) => {
    await storeData("selectedDevice", device);
    const data = await getData("selectedDevice");
    if (data.dbError) return { status: true, data: data };
    else return { ...data };
  };

  const updateSelectedDevice = async (device) => {
    return await storeData("selectedDevice", device);
  };

  const getSelectedDevice = async () => {
    const data = await getData("selectedDevice");
    if (data.dbError) return { status: false, ...data };
    return {
      status: true,
      data: data,
    };
  };
  const removeSelectedDevice = async () => {
    return await storeData("selectedDevice", null);
  };

  const storageActions = {
    storeData,
    getData,
    resetStorage,
  };

  const devicesActions = {
    addDevice,
    removeDevice,
    updateDevice,
    clearDevices,
    getDevices,
    getDevice,
  };

  const selectedDeviceActions = {
    setSelectedDevice,
    getSelectedDevice,
    updateSelectedDevice,
    removeSelectedDevice,
  };
  return (
    <DatabaseContext.Provider
      value={{ storageActions, devicesActions, selectedDeviceActions }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};
export default useDatabase;

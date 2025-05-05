import { View, Text, StyleSheet, Animated, Easing, TouchableOpacity } from 'react-native';
import { useState, useEffect, useRef, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Network from 'expo-network';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAppState } from './context/appState';

interface Device {
  id: string;
  name: string;
  ip: string;
  firmwareVersion?: string;
  batteryLevel?: number;
  type?: string;
}

export default function Index() {
  const { ipAddress, setIpAddress } = useAppState();
  const { isAddNewDevice, setIsAddNewDevice } = useAppState();
  const [isDeviceConnected, setIsDeviceConnected] = useState(false);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isStoredDevice, setIsStoredDevice] = useState(false);
  const spinValue = useRef(new Animated.Value(0)).current;
  const router = useRouter();


  // Start radar animation
  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const handleDeviceFound = async (device: Device) => {
    // Store device in the list of devices
    const storedDevices = await AsyncStorage.getItem('storedDevices');
    let devices = storedDevices ? JSON.parse(storedDevices) : [];

    // Check if device already exists
    const existingDeviceIndex = devices.findIndex((d: Device) => d.id === device.id);
    if (existingDeviceIndex >= 0) {
      devices[existingDeviceIndex] = device;
    } else {
      devices.push(device);
    }

    await AsyncStorage.setItem('storedDevices', JSON.stringify(devices));

    // Set as selected device
    await AsyncStorage.setItem('selectedDevice', JSON.stringify(device));
    setIsDeviceConnected(true);
    setIsAddNewDevice(false);
  };

  // Update the device scanning logic
  useEffect(() => {
    const scanDevices = async () => {
      try {
        const ipAddress = await Network.getIpAddressAsync();
        setIpAddress(ipAddress);
        const baseIp = ipAddress.split('.').slice(0, 3).join('.');

        for (let i = 1; i <= 255; i++) {
          const targetIp = `${baseIp}.${i}`;
          fetch(`http://${targetIp}`, { method: 'GET' }).then(
            async (response) => {
              if (response.status === 200) {
                const data = await response.json();
                if (data.deviceID) {
                  const device = {
                    id: data.deviceID,
                    name: data.deviceName || `Device ${data.deviceID}`,
                    ip: targetIp,
                    firmwareVersion: data?.firmwareVersion,
                    batteryLevel: data?.batteryLevel,
                    type: data?.type,
                  };

                  setDevices(devices => [...devices.filter(d => d.id !== device.id), device]);
                }
              }
            }
          ).catch((error) => {
          })


        }
      } catch (error) {
        console.error('Error scanning devices:', error);
      }
    };

    scanDevices();
    const scanInterval = setInterval(scanDevices, 5000);
    return () => clearInterval(scanInterval);
  }, []);

  // On mount, check for stored device and navigate if found
  useEffect(() => {
    const checkStoredDevice = async () => {
      const stored = await AsyncStorage.getItem('selectedDevice');
      if (stored) {
        setIsStoredDevice(true);
      }
      if (stored && !isAddNewDevice) {
        router.replace('/ConnectedPage');
      }
    };
    checkStoredDevice();
  }, [isAddNewDevice]);

  useEffect(() => {
    if (isDeviceConnected) {
      router.replace('/ConnectedPage');
    }
  }, [isDeviceConnected]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  if (isDeviceConnected) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.title}>Searching for Devices</Text>
        {isStoredDevice && <TouchableOpacity style={styles.homeButton} onPress={() => {
          router.replace('/ConnectedPage');
        }}>
          <Ionicons name="home" size={24} color="#007AFF" />
        </TouchableOpacity>}
      </View>
      <Text style={styles.ipAddress}>{ipAddress}</Text>

      <View style={styles.radarContainer}>
        <Animated.View
          style={[
            styles.radar,
            {
              transform: [{ rotate: spin }],
            },
          ]}
        >
          <View style={styles.radarLine} />
        </Animated.View>

        {/* Device indicators */}
        {devices.map((device, index) => {
          console.log(device);
          const angle = (index * 360) / devices.length;
          return (
            <View
              key={device.id}
              style={[
                styles.deviceIndicator,
                {
                  transform: [
                    { rotate: `${angle}deg` },
                    { translateX: 100 },
                  ],
                },
              ]}
            >

              {device.type === "cooler" ?
                <Ionicons name="snow" size={20} color="white" /> :
                <Ionicons name="phone-portrait" size={20} color="white" />}
            </View>
          );
        })}
      </View>

      <View style={styles.deviceList}>
        {devices.map((device) => (
          <TouchableOpacity key={device.id} onPress={async () => {
            handleDeviceFound(device);
          }} >

            <View style={styles.deviceItem}>
              {device.type === "cooler" ?
                <Ionicons name="snow" size={24} color="#007AFF" />
                :
                <Ionicons name="phone-portrait" size={24} color="#007AFF" />}
              <View style={styles.deviceInfo} >
                <Text style={styles.deviceName}>{device.name}</Text>
                <Text style={styles.deviceIp}>{device.ip}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  radarContainer: {
    height: 300,
    width: 300,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  radar: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#007AFF',
    position: 'relative',
  },
  radarLine: {
    position: 'absolute',
    width: 2,
    height: 100,
    backgroundColor: '#007AFF',
    top: 0,
    left: '50%',
    transform: [{ translateX: -1 }],
  },
  deviceIndicator: {
    position: 'absolute',
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#007AFF",
    borderRadius: 100,
  },
  deviceList: {
    marginTop: 20,
  },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 10,
  },
  deviceInfo: {
    marginLeft: 15,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  deviceIp: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  homeButton: {
    borderRadius: 10,
  },
  ipAddress: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}); 
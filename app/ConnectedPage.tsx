import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Network from 'expo-network';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Sidebar from './components/Sidebar';
import DisplaySettings from './display/DisplaySettings';
import CoolerSettings from './cooler/CoolerSettings';



export default function ConnectedPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [status, setStatus] = useState<DeviceInfo['status']>('connecting');
  const [currentIp, setCurrentIp] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    setStatus(device?.status || 'connecting');
  }, [device?.status]);


  useEffect(() => {
    const fetchDevice = async () => {
      const stored = await AsyncStorage.getItem('selectedDevice');
      if (!stored) {
        setStatus('not_found');
        return;
      }
      const storedDevice = JSON.parse(stored);
      setDevice(storedDevice);
      setCurrentIp(storedDevice.ip);
    }
    fetchDevice();
  }, []);

  const checkConnection = async () => {
    setStatus('connecting');
    const stored = await AsyncStorage.getItem('selectedDevice');
    if (!stored) {
      setStatus('not_found');
      return;
    }
    const storedDevice = JSON.parse(stored);
    setDevice(storedDevice);
    setCurrentIp(storedDevice.ip);

    // Check WiFi status
    const wifi = await Network.getNetworkStateAsync();
    if (!wifi.isConnected || wifi.type !== Network.NetworkStateType.WIFI) {
      setStatus('not_found');
      return;
    }

    // Try to connect to stored IP
    try {
      const response = await fetch(`http://${storedDevice.ip}`, { method: 'GET' });
      if (response.status === 200) {
        const data = await response.json();
        // Update device info with latest data
        const updatedDevice = {
          ...storedDevice,
          type: data.type,
          firmwareVersion: data.firmwareVersion,
          batteryLevel: data.batteryLevel,
          lastConnected: new Date().toISOString(),
        };
        try {
          const response2 = await fetch(`http://${storedDevice.ip}/cooler_status`, { method: 'GET' });
          if (response2.status === 200) {
            const data2 = await response2.json();
            updatedDevice.coolerSettings = data2;
          }
        } catch (e) {
          console.log("error fetching cooler settings");
        }
        await AsyncStorage.setItem('selectedDevice', JSON.stringify(updatedDevice));
        setDevice(updatedDevice);
        setStatus('connected');
        return;
      } else {
        setStatus("not_found");
      }
    } catch (e) {
      setStatus("not_found");
    }

    // If not found, scan for device
    setStatus('scanning');
    const ipAddress = await Network.getIpAddressAsync();
    const baseIp = ipAddress.split('.').slice(0, 3).join('.');
    for (let i = 1; i <= 255; i++) {
      const targetIp = `${baseIp}.${i}`;
      fetch(`http://${targetIp}/`, { method: 'GET' }).then(
        async (response) => {
          if (response.status === 200) {
            const data = await response.json();
            if (data.deviceID === storedDevice.id) {
              const updatedDevice = {
                ...storedDevice,
                type: data.type,
                ip: targetIp,
                firmwareVersion: data?.firmwareVersion,
                batteryLevel: data?.batteryLevel,
                lastConnected: new Date().toISOString(),
              };
              await AsyncStorage.setItem('selectedDevice', JSON.stringify(updatedDevice));
              setDevice(() => updatedDevice);
              setCurrentIp(() => targetIp);
              setStatus('connected');
              return;
            }
          }
        }
      )
    }
    setStatus('not_found');
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const fetchCoolerSettings = async () => {
    if (!device) return;
    fetch(`http://${device.ip}/cooler_status`, { method: 'GET' }).then(response => response.json())
      .then(data => {
        console.log(data);
        setDevice(prev => {
          if (!prev) return null;
          return {
            ...prev,
            coolerSettings: data
          };
        });
      }).catch(_ => {
        console.log("error fetching cooler settings");
        setStatus('not_found');
        setTimeout(() => {
          fetchCoolerSettings();
        }, 1500);
      });
  }

  useEffect(() => {
    if (device?.type === "cooler") {
      fetchCoolerSettings();
    }
  }, [device?.type, device?.ip]);


  return (
    <View style={styles.container}>
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsSidebarOpen(true)} style={styles.backButton}>
          <Ionicons name="menu" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Device Status</Text>
        <TouchableOpacity onPress={() => router.push('/settings')} style={styles.settingsButton}>
          <Ionicons name="settings-outline" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {device && (
          <View style={styles.deviceInfo}>
            <Text style={styles.deviceName}>{device.nickname || device.name}</Text>
            <Text style={styles.deviceId}>ID: {device.id}</Text>
            {currentIp && <Text style={styles.ip}>IP: {currentIp}</Text>}
          </View>
        )}

        <View style={styles.statusContainer}>
          <Text style={styles.statusLabel}>Connection Status:</Text>
          {status === 'connecting' && (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.statusText}>Connecting...</Text>
            </View>
          )}
          {status === 'connected' && (
            <View style={styles.statusRow}>
              <Ionicons name="checkmark-circle" size={24} color="#34C759" />
              <Text style={[styles.statusText, styles.connectedText]}>Connected</Text>
            </View>
          )}
          {status === 'scanning' && (
            <View style={styles.statusRow}>
              <ActivityIndicator size="small" color="#007AFF" />
              <Text style={styles.statusText}>Scanning for device...</Text>
            </View>
          )}
          {status === 'not_found' && (
            <View style={styles.statusRow}>
              <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              <Text style={[styles.statusText, styles.errorText]}>Device not found</Text>
              <TouchableOpacity onPress={() => checkConnection()} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
          {status === 'disconnected' && (
            <View style={styles.statusRow}>
              <Ionicons name="alert-circle" size={24} color="#FF3B30" />
              <Text style={[styles.statusText, styles.errorText]}>Device disconnected</Text>
              <TouchableOpacity onPress={() => checkConnection()} style={styles.retryButton}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* {status === 'connected' && ( */}
        {device?.type === "cooler" ?
          <CoolerSettings device={device} setDevice={setDevice} /> :
          <DisplaySettings device={device} setDevice={setDevice} />}
        {/* )} */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingsButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  deviceInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  deviceName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  deviceId: {
    fontSize: 16,
    color: '#666',
    marginBottom: 5,
  },
  ip: {
    fontSize: 16,
    color: '#666',
  },
  statusContainer: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginLeft: 10,
  },
  connectedText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  deviceStatus: {
    marginTop: 20,
  },
  statusCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 20,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginRight: 10,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  retryButton: {
    marginLeft: 10,
  },
  retryText: {
    color: '#007AFF',
  },
}); 
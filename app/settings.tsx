import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface DeviceInfo {
  id: string;
  name: string;
  ip: string;
  nickname?: string;
  lastConnected?: string;
  firmwareVersion?: string;
  batteryLevel?: number;
}

export default function Settings() {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [nickname, setNickname] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadDeviceInfo();
  }, []);

  const loadDeviceInfo = async () => {
    const stored = await AsyncStorage.getItem('selectedDevice');
    if (stored) {
      const deviceInfo = JSON.parse(stored);
      setDevice(deviceInfo);
      setNickname(deviceInfo.nickname || '');
    }
  };

  const saveNickname = async () => {
    if (!device) return;

    const updatedDevice = {
      ...device,
      nickname,
      lastConnected: new Date().toISOString(),
    };

    await AsyncStorage.setItem('selectedDevice', JSON.stringify(updatedDevice));
    setDevice(updatedDevice);
    Alert.alert('Success', 'Nickname updated successfully');
  };

  const deleteDevice = () => {
    Alert.alert(
      'Delete Device',
      'Are you sure you want to remove this device?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('selectedDevice');
            router.replace('/');
          },
        },
      ]
    );
  };

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No device selected</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Device Settings</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Information</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Device Name:</Text>
            <Text style={styles.value}>{device.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Nickname:</Text>
            <Text style={styles.value}>{device.nickname}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>IP Address:</Text>
            <Text style={styles.value}>{device.ip}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Device ID:</Text>
            <Text style={styles.value}>{device.id}</Text>
          </View>
          {device.lastConnected && (
            <View style={styles.infoRow}>
              <Text style={styles.label}>Last Connected:</Text>
              <Text style={styles.value}>
                {new Date(device.lastConnected).toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Nickname</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={nickname}
            onChangeText={setNickname}
            placeholder="Enter device nickname"
            placeholderTextColor="#666"
          />
          <TouchableOpacity style={styles.saveButton} onPress={saveNickname}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Device Status</Text>
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Firmware Version:</Text>
            <Text style={styles.value}>{device.firmwareVersion || 'Unknown'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Battery Level:</Text>
            <Text style={styles.value}>
              {device.batteryLevel ? `${device.batteryLevel}%` : 'Unknown'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={deleteDevice}>
        <Ionicons name="trash-outline" size={24} color="#FF3B30" />
        <Text style={styles.deleteButtonText}>Delete Device</Text>
      </TouchableOpacity>
    </ScrollView>
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
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  infoCard: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    marginLeft: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFE5E5',
    margin: 20,
    padding: 15,
    borderRadius: 10,
  },
  deleteButtonText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
}); 
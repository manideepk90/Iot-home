import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAppState } from '../context/appState';

interface Device {
    id: string;
    name: string;
    ip: string;
    nickname?: string;
    lastConnected?: string;
}

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = "100%";

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { setIsAddNewDevice } = useAppState();
    const [devices, setDevices] = useState<Device[]>([]);
    const router = useRouter();

    useEffect(() => {
        if (isOpen) {
            loadDevices();
        }
    }, [isOpen]);


    const loadDevices = async () => {
        try {
            const storedDevices = await AsyncStorage.getItem('storedDevices');
            if (storedDevices) {
                setDevices(JSON.parse(storedDevices));
            }
        } catch (error) {
            console.error('Error loading devices:', error);
        }
    };

    const selectDevice = async (device: Device) => {
        await AsyncStorage.setItem('selectedDevice', JSON.stringify(device));
        router.replace('/ConnectedPage');
        onClose();
    };

    const addNewDevice = () => {

        setIsAddNewDevice(true);
        router.replace('/');

    };

    return (
        <View style={[styles.overlay, {
            display: isOpen ? 'flex' : 'none'
        }]}>
            {isOpen && (
                <TouchableOpacity
                    style={[styles.backdrop, {
                        display: isOpen ? 'flex' : 'none'
                    }]}
                    onPress={onClose}
                    activeOpacity={1}
                />
            )}

            <Animated.View
                style={[
                    styles.container
                ]}
            >
                <View style={styles.header}>
                    <Text style={styles.title}>Pixeler</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Ionicons name="close" size={24} color="#666" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.deviceList}>
                    {devices.map((device) => (
                        <TouchableOpacity
                            key={device.id}
                            style={styles.deviceItem}
                            onPress={() => selectDevice(device)}
                        >
                            <Ionicons name="phone-portrait" size={24} color="#007AFF" />
                            <View style={styles.deviceInfo}>
                                <Text style={styles.deviceName}>{device.nickname || device.name}</Text>
                                <Text style={styles.deviceIp}>{device.ip}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity style={styles.addButton} onPress={addNewDevice}>
                    <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                    <Text style={styles.addButtonText}>Add New Device</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        backgroundColor: 'white',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    container: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: '100%',
        width: SIDEBAR_WIDTH,
        borderRightWidth: 1,
        borderRightColor: '#eee',
        zIndex: 1000,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    closeButton: {
        padding: 5,
    },
    deviceList: {
        flex: 1,
    },
    deviceItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
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
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#eee',
    },
    addButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#007AFF',
        marginLeft: 10,
    },
}); 
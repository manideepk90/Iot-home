import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
export default function CoolerSettings({
    device,
    setDevice
}: {
    device: DeviceInfo | null;
    setDevice: (device: DeviceInfo) => void;
}) {
    const [coolerSettings, setCoolerSettings] = useState<CoolerSettings | undefined>(undefined);
    useEffect(() => {
        setCoolerSettings(device?.coolerSettings);
    }, [device?.coolerSettings]);

    const handleCoolerStateChange = async () => {
        setCoolerSettings(prev => {
            const newState = { ...(prev || {}), coolerState: ((prev?.coolerState || 0) + 1) % 2 } as CoolerSettings;
            return newState;
        });
        await fetch(`http://${device?.ip}/cooler_status`,
            { method: 'POST', body: JSON.stringify({ coolerState: ((coolerSettings?.coolerState || 0) + 1) % 3 }) })
            .then(response => response.json())
            .then((data: CoolerSettings) => {
                console.log(data.coolState);
                setCoolerSettings(prev => ({ ...(prev || {}), ...data } as CoolerSettings));
                if (device) {
                    setDevice({ ...device, status: "connected" });
                }
            }).catch(error => {
                setCoolerSettings(prev => ({ ...(prev || {}), coolerState: ((prev?.coolerState || 0) - 1) % 3 } as CoolerSettings));
                console.error(error);
                if (device) {
                    setDevice({ ...device, status: "disconnected" });
                }
            });
    }

    const handleCoolStateChange = async (state: number) => {
        setCoolerSettings(prev => ({ ...(prev || {}), coolState: state } as CoolerSettings));
        await fetch(`http://${device?.ip}/cooler_status`, { method: 'POST', body: JSON.stringify({ coolState: state }) }).then(response => response.json())
            .then(data => {
                console.log(data);
                setCoolerSettings(prev => ({ ...(prev || {}), coolState: state } as CoolerSettings));
                if (device) {
                    setDevice({ ...device, status: "connected" });
                }
            }).catch(error => {
                setCoolerSettings(prev => ({ ...(prev || {}), coolState: ((prev?.coolState || 0) === 0 ? 1 : 0) } as CoolerSettings));
                console.error(error);
                if (device) {
                    setDevice({ ...device, status: "disconnected" });
                }
            });
    }

    const handleSwingStateChange = async (state: number) => {
        setCoolerSettings(prev => ({ ...(prev || {}), swingState: state } as CoolerSettings));
        await fetch(`http://${device?.ip}/cooler_status`, { method: 'POST', body: JSON.stringify({ swingState: state }) }).then(response => response.json())
            .then(data => {
                console.log(data);
                setCoolerSettings(prev => ({ ...(prev || {}), swingState: state } as CoolerSettings));
                if (device) {
                    setDevice({ ...device, status: "connected" });
                }
            }).catch(error => {
                setCoolerSettings(prev => ({ ...(prev || {}), swingState: ((prev?.swingState || 0) === 0 ? 1 : 0) } as CoolerSettings));
                console.error(error);
                if (device) {
                    setDevice({ ...device, status: "disconnected" });
                }
            });
    }

    const getCoolerStateText = (state: number | undefined) => {
        switch (state) {
            case 1: return "LOW";
            case 2: return "MEDIUM";
            case 3: return "HIGH";
            default: return "OFF";
        }
    };
    const getCoolerStateEmoji = (state: number | undefined) => {
        switch (state) {
            case 1: return "❄️";
            case 2: return "❄️❄️";
            case 3: return "❄️❄️❄️";
            default: return "🔥";
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <Text style={styles.title}>Cooler</Text>
                <View style={styles.moodList}>

                    <TouchableOpacity
                        style={[
                            styles.moodItem,
                            ((coolerSettings?.coolerState || 0) > 0) && styles.selectedMood
                        ]}
                        onPress={() => handleCoolerStateChange()}
                    >
                        <Text style={[styles.emoji, { color: (coolerSettings?.coolerState || 0) > 0 ? "white" : "black" }]}>
                            {getCoolerStateEmoji(coolerSettings?.coolerState)}
                        </Text>
                        <Text style={[styles.label, { color: (coolerSettings?.coolerState || 0) > 0 ? "white" : "black" }]}>Speed</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.moodItem,
                            coolerSettings?.coolState === 1 && styles.selectedMood
                        ]}
                        onPress={() => handleCoolStateChange(coolerSettings?.coolState || 0 !== 0 ? 0 : 1)}
                    >
                        <Text style={[styles.emoji, { color: coolerSettings?.coolState === 1 ? "white" : "black" }]}>{getCoolerStateEmoji(coolerSettings?.coolState)}</Text>
                        <Text style={[styles.label, { color: coolerSettings?.coolState === 1 ? "white" : "black" }]}>Cool</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.moodItem,
                            coolerSettings?.swingState === 1 && styles.selectedMood
                        ]}
                        onPress={() => handleSwingStateChange(coolerSettings?.swingState || 0 !== 0 ? 0 : 1)}
                    >
                        <Text style={[styles.emoji, { color: coolerSettings?.swingState === 1 ? "white" : "black" }]}>{getCoolerStateEmoji(coolerSettings?.swingState)}</Text>
                        <Text style={[styles.label, { color: coolerSettings?.swingState === 1 ? "white" : "black" }]}>Swing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 15,
        color: '#333',
    },
    moodList: {
        // paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: "center",
        width: "100%",
        display: "flex",
        gap: 10,
    },
    moodItem: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f8f8f8',
        minWidth: 80,
        flex: 1,
    },
    selectedMood: {
        backgroundColor: '#007AFF',
        color: "white"
    },
    emoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    label: {
        fontSize: 14,
        color: '#333',
    },
}); 
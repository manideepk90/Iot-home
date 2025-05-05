import { View } from "react-native";
import ImageSelector from "../components/ImageSelector";
import MoodSelector from "../components/MoodSelector";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DisplaySettings({
    device,
    setDevice
}: {
    device: DeviceInfo | null;
    setDevice: (device: DeviceInfo) => void;
}) {

    const [selectedMood, setSelectedMood] = useState<string>('');
    const [savedImages, setSavedImages] = useState<string[]>([]);

    const loadSavedImages = async () => {
        try {
            const storedImages = await AsyncStorage.getItem('deviceImages');
            if (storedImages) {
                setSavedImages(JSON.parse(storedImages));
            }
        } catch (error) {
            console.error('Error loading images:', error);
        }
    };
    useEffect(() => {
        loadSavedImages();
    }, []);
    const handleMoodSelect = async (mood: string) => {
        setSelectedMood(mood);
        if (device) {
            const updatedDevice = {
                ...device,
                mood,
            };
            await AsyncStorage.setItem('selectedDevice', JSON.stringify(updatedDevice));
            setDevice(updatedDevice);
        }
    };

    const handleImageSelect = async (imageUri: string) => {
        if (device) {
            const updatedDevice = {
                ...device,
                selectedImage: imageUri,
            };
            await AsyncStorage.setItem('selectedDevice', JSON.stringify(updatedDevice));
            setDevice(updatedDevice);
        }
    };

    const handleImagePicked = async (imageUri: string) => {
        setSavedImages([...savedImages, imageUri]);
        await AsyncStorage.setItem('deviceImages', JSON.stringify(savedImages));
    };

    const handleImageDelete = async (imageUri: string) => {
        const updatedImages = savedImages.filter(uri => uri !== imageUri);
        setSavedImages(updatedImages);
        await AsyncStorage.setItem('deviceImages', JSON.stringify(updatedImages));
    };

    return (
        <View>
            <MoodSelector
                onMoodSelect={handleMoodSelect}
                selectedMood={selectedMood}
            />

            <ImageSelector
                onImagePicked={handleImagePicked}
                onImageSelect={handleImageSelect}
                savedImages={savedImages}
                onImageDelete={handleImageDelete}
            />
        </View>
    )
}
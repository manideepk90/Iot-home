import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface ImageSelectorProps {
    onImagePicked: (imageUri: string) => void;
    onImageSelect: (imageUri: string) => void;
    savedImages?: string[];
    onImageDelete: (imageUri: string) => void;
}

export default function ImageSelector({ onImagePicked, onImageSelect, savedImages = [], onImageDelete }: ImageSelectorProps) {
    const router = useRouter();

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: 'images',
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            onImagePicked(result.assets[0].uri);
        }
    };

    const navigateToGallery = () => {
        router.push('/gallery');
    };

    const deleteImage = (uri: string) => {
        Alert.alert('Delete Image', 'Are you sure you want to delete this image?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Delete', style: 'destructive', onPress: () => onImageDelete(uri) },
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Images</Text>
                <TouchableOpacity style={styles.addButton} onPress={pickImage}>
                    <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
                    <Text style={styles.addButtonText}>Add New</Text>
                </TouchableOpacity>
            </View>

            {savedImages.length > 0 ? (
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.imageList}
                >
                    {savedImages.map((uri, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.imageContainer}
                            onPress={() => onImageSelect(uri)}
                            onLongPress={() => deleteImage(uri)}
                        >
                            <Image source={{ uri }} style={styles.image} />
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            ) : (
                <TouchableOpacity style={styles.emptyState} onPress={pickImage}>
                    <Ionicons name="images-outline" size={48} color="#666" />
                    <Text style={styles.emptyStateText}>No images yet. Tap to add one!</Text>
                </TouchableOpacity>
            )}

            {savedImages.length > 0 && (
                <TouchableOpacity style={styles.viewAllButton} onPress={navigateToGallery}>
                    <Text style={styles.viewAllText}>View All Images</Text>
                    <Ionicons name="chevron-forward" size={20} color="#007AFF" />
                </TouchableOpacity>
            )}
        </View>
    );
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    addButtonText: {
        fontSize: 16,
        color: '#007AFF',
        marginLeft: 5,
    },
    imageList: {
        paddingRight: 15,
    },
    imageContainer: {
        marginRight: 10,
        borderRadius: 10,
        overflow: 'hidden',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
    emptyState: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    emptyStateText: {
        marginTop: 10,
        color: '#666',
        textAlign: 'center',
    },
    viewAllButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        padding: 10,
        backgroundColor: '#f8f8f8',
        borderRadius: 10,
    },
    viewAllText: {
        fontSize: 16,
        color: '#007AFF',
        marginRight: 5,
    },
}); 
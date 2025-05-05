import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

interface MoodSelectorProps {
  onMoodSelect: (mood: string) => void;
  selectedMood?: string;
}

const moods = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😌', label: 'Calm' },
  { emoji: '😴', label: 'Sleepy' },
  { emoji: '🎉', label: 'Party' },
  { emoji: '🎨', label: 'Creative' },
  { emoji: '🎵', label: 'Music' },
  { emoji: '📚', label: 'Reading' },
  { emoji: '🏃', label: 'Active' },
  { emoji: '🌙', label: 'Night' },
  { emoji: '☀️', label: 'Day' },
];

export default function MoodSelector({ onMoodSelect, selectedMood }: MoodSelectorProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Mood</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.moodList}
      >
        {moods.map((mood) => (
          <TouchableOpacity
            key={mood.label}
            style={[
              styles.moodItem,
              selectedMood === mood.label && styles.selectedMood
            ]}
            onPress={() => onMoodSelect(mood.label)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  moodList: {
    paddingRight: 15,
  },
  moodItem: {
    alignItems: 'center',
    marginRight: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    minWidth: 80,
  },
  selectedMood: {
    backgroundColor: '#007AFF',
  },
  emoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    color: '#333',
  },
}); 
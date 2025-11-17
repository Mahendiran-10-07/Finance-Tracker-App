// src/screens/LockScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

// This screen receives one function as a prop: 'onUnlock'
// This function will be passed in from our main navigator
export default function LockScreen({ onUnlock }) {
  return (
    <SafeAreaView style={styles.container}>
      <Ionicons name="lock-closed" size={80} color={COLORS.white} />
      <Text style={styles.title}>App Locked</Text>
      <Text style={styles.subtitle}>
        Please authenticate to continue
      </Text>
      
      <TouchableOpacity style={styles.button} onPress={onUnlock}>
        <Ionicons name="finger-print-outline" size={24} color={COLORS.secondary} />
        <Text style={styles.buttonText}>Unlock App</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary, // Your blue color
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.lightGray,
    marginTop: 8,
  },
  button: {
    marginTop: 60,
    backgroundColor: COLORS.white,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: 'bold',
    marginLeft: 10,
  },
});
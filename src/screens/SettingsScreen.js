// src/screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, Switch, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS } from '../constants/colors';
// We don't need exportData here anymore
// import { exportData } from '../utils/DataExporter';

const APP_LOCK_KEY = '@app_lock_enabled';

export default function SettingsScreen({ navigation }) {
  const [isLockEnabled, setIsLockEnabled] = useState(false);

  // Load the lock status when the screen opens
  useEffect(() => {
    const loadLockStatus = async () => {
      const storedValue = await AsyncStorage.getItem(APP_LOCK_KEY);
      setIsLockEnabled(storedValue === 'true');
    };
    loadLockStatus();
  }, []);

  // Handle the toggle switch
  const onToggleAppLock = async (value) => {
    setIsLockEnabled(value);
    
    if (value) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      if (!hasHardware) {
        Alert.alert('Error', 'Your device does not support biometric authentication.');
        setIsLockEnabled(false);
        return;
      }
      
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      if (!isEnrolled) {
        Alert.alert(
          'Error', 
          'You have not set up a Fingerprint, PIN, or Face ID on your device. Please set one up in your device settings.',
          [{ text: 'OK', onPress: () => setIsLockEnabled(false) }]
        );
        return;
      }

      await AsyncStorage.setItem(APP_LOCK_KEY, 'true');
      Alert.alert('Success', 'App Lock has been enabled.');
    } else {
      await AsyncStorage.setItem(APP_LOCK_KEY, 'false');
      Alert.alert('Success', 'App Lock has been disabled.');
    }
  };

  // --- (Your existing functions) ---
  const deleteAllData = async () => {
    try {
      await AsyncStorage.removeItem('@received_transactions');
      await AsyncStorage.removeItem('@spent_transactions');
      Alert.alert(
        'Success',
        'All transaction data has been deleted.'
      );
    } catch (e) {
      console.error('Failed to delete data', e);
      Alert.alert('Error', 'Failed to delete data.');
    }
  };
  const confirmDelete = () => {
    Alert.alert(
      'Delete All Data',
      'Are you sure you want to delete ALL received and spent transactions? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: deleteAllData, style: 'destructive' },
      ],
      { cancelable: true }
    );
  };
  const handleExport = () => { navigation.navigate('Export'); };

  return (
    <ScrollView style={styles.container}
    contentContainerStyle={styles.contentContainer}
    >
      
      {/* --- SECURITY SECTION --- */}
      <Text style={styles.header}>Security</Text>
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable App Lock</Text>
        <Switch
          trackColor={{ false: '#767577', true: COLORS.primary }}
          thumbColor={isLockEnabled ? COLORS.white : '#f4f3f4'}
          onValueChange={onToggleAppLock}
          value={isLockEnabled}
        />
      </View>
      <Text style={styles.description}>
        Use your device's Fingerprint, PIN, or Face ID to secure the app.
      </Text>

      {/* --- EXPORT SECTION --- */}
      <Text style={styles.sectionHeader}>Export Data</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Export Data..."
          onPress={handleExport} 
          color={COLORS.secondary}
        />
      </View>
      <Text style={styles.description}>
        This will open a screen with export options.
      </Text>

      {/* --- NEW ABOUT & HELP SECTION --- */}
      <Text style={styles.sectionHeader}>About & Help</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="About This App"
          onPress={() => navigation.navigate('About')} // <-- NEW
          color={COLORS.secondary}
        />
      </View>
      <Text style={styles.description}>
        View app info, help guide, and credits.
      </Text>
      {/* --- END NEW SECTION --- */}

      {/* --- DELETE SECTION --- */}
      <Text style={[styles.header, styles.dangerHeader]}>Data Management</Text>
      <View style={styles.buttonContainer}>
        <Button 
          title="Delete All Transaction Data" 
          onPress={confirmDelete}
          color={COLORS.primary}
        />
      </View>
      <Text style={styles.description}>
        This will permanently delete all saved "Received" and "Spent" items.
      </Text>

    </ScrollView> // <-- Make sure this is a ScrollView
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  contentContainer: { 
    padding: 20, 
    paddingBottom: 60, 
  },
  settingRow: {
    backgroundColor: COLORS.white,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  settingLabel: {
    fontSize: 16,
    color: COLORS.secondary,
    flex: 1, // Fix for text cutoff
    marginRight: 10, // Fix for text cutoff
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
    marginTop: 20,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginBottom: 10,
    marginTop: 40,
  },
  dangerHeader: {
    marginTop: 40,
  },
  buttonContainer: {
    backgroundColor: COLORS.white,
    padding: 15,
    borderRadius: 8,
    elevation: 2,
  },
  description: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 10,
    textAlign: 'center',
    marginBottom: 10,
  },
});
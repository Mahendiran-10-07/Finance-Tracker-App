// src/navigation/AppNavigator.js
import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';

// Import all your screens
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddReceivedScreen from '../screens/AddReceivedScreen';
import AddSpentScreen from '../screens/AddSpentScreen';
import TransactionDetailScreen from '../screens/TransactionDetailScreen';
import ExportScreen from '../screens/ExportScreen';
import LockScreen from '../screens/LockScreen';
import AddSubExpenseScreen from '../screens/AddSubExpenseScreen';
import AboutScreen from '../screens/AboutScreen'; // <-- NEW: Import About Screen

import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const APP_LOCK_KEY = '@app_lock_enabled';

// --- 1. Your Tab Navigator (No changes) ---
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarStyle: {
          backgroundColor: COLORS.secondary, // Blue background
          borderTopWidth: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        headerStyle: { backgroundColor: COLORS.secondary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

// --- 2. Your Full App Stack ---
function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AddReceived"
        component={AddReceivedScreen}
        options={{
          presentation: 'modal',
          title: 'Add Received Transaction',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="AddSpent"
        component={AddSpentScreen}
        options={{
          presentation: 'modal',
          title: 'Add Spent Transaction',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="TransactionDetail"
        component={TransactionDetailScreen}
        options={{
          title: 'Transaction Details',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="Export"
        component={ExportScreen}
        options={{
          presentation: 'modal',
          title: 'Export Data',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
      <Stack.Screen
        name="AddSubExpense"
        component={AddSubExpenseScreen}
        options={{
          presentation: 'modal',
          title: 'Add Linked Expense',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
      {/* --- NEW SCREEN --- */}
      <Stack.Screen
        name="About"
        component={AboutScreen}
        options={{
          title: 'About & Help',
          headerStyle: { backgroundColor: COLORS.secondary },
          headerTintColor: COLORS.white,
        }}
      />
    </Stack.Navigator>
  );
}

// --- 3. The new AppNavigator (This is the main export) ---
export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  // Check the lock status when the app starts
  useEffect(() => {
    const checkLockStatus = async () => {
      const lockEnabled = await AsyncStorage.getItem(APP_LOCK_KEY);
      if (lockEnabled === 'true') {
        setIsLocked(true);
      }
      setIsLoading(false);
    };
    checkLockStatus();
  }, []);

  // Function to handle unlocking
  const handleUnlock = async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Please authenticate to unlock the app',
      });

      if (result.success) {
        setIsLocked(false);
      } else {
        // User cancelled or failed
      }
    } catch (e) {
      console.error('Authentication error', e);
    }
  };

  // --- Render logic ---
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }
  if (isLocked) {
    return <LockScreen onUnlock={handleUnlock} />;
  }
  return <AppStack />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
  },
});
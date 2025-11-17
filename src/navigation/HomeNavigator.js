// src/navigation/HomeNavigator.js
import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ReceivedScreen from '../screens/ReceivedScreen';
import SpentScreen from '../screens/SpentScreen';
import { COLORS } from '../constants/colors';

const Tab = createMaterialTopTabNavigator();

export default function HomeNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: COLORS.white,
        tabBarInactiveTintColor: COLORS.lightGray,
        tabBarLabelStyle: { fontSize: 14, fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: COLORS.secondary }, // <-- CHANGE THIS
        tabBarIndicatorStyle: {
          backgroundColor: COLORS.white,
          height: 3,
        },
      }}
    >
      <Tab.Screen name="Received" component={ReceivedScreen} />
      <Tab.Screen name="Spent" component={SpentScreen} />
    </Tab.Navigator>
  );
}
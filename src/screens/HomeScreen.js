// src/screens/HomeScreen.js
import React from 'react';
import { StyleSheet } from 'react-native';
import HomeNavigator from '../navigation/HomeNavigator';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../constants/colors';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <HomeNavigator />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.secondary, // <-- CHANGE THIS
  },
});
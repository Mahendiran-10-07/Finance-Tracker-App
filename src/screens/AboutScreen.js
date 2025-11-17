// src/screens/AboutScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { COLORS } from '../constants/colors';

export default function AboutScreen() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About This App</Text>
      <Text style={styles.body}>App Version: 1.0.0</Text>
      
      <Text style={styles.header}>Help Guide</Text>
      <Text style={styles.subHeader}>How to link expenses to income:</Text>
      <Text style={styles.body}>
        This app's main feature is tracking your balance from a specific income source.
      </Text>
      <Text style={styles.listItem}>
        1. Add a new income transaction in the "Received" tab.
      </Text>
      <Text style={styles.listItem}>
        2. Tap on that new card in the list to see its details.
      </Text>
      <Text style={styles.listItem}>
        3. On the "Transaction Details" screen, tap the "Add Spent (from this)" button.
      </Text>
      <Text style={styles.listItem}>
        4. Fill in the form for what you spent.
      </Text>
      <Text style={styles.listItem}>
        5. The app will automatically calculate the "Current Balance" for that income on the detail screen.
      </Text>

      <Text style={styles.creditText}>
        This app is created by 😇mahi😇
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 10,
    marginBottom: 10,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 15,
    marginBottom: 5,
  },
  body: {
    fontSize: 16,
    color: COLORS.darkGray,
    lineHeight: 24,
  },
  listItem: {
    fontSize: 16,
    color: COLORS.darkGray,
    lineHeight: 24,
    marginLeft: 10,
    marginBottom: 5,
  },
  creditText: {
    marginTop: 60,
    fontSize: 16,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    textAlign: 'center',
    marginBottom: 40,
  },
});
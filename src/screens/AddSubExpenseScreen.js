// src/screens/AddSubExpenseScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddSubExpenseScreen({ route, navigation }) {
  // Get the info passed from the detail screen
  const { transactionId, storageKey } = route.params;

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(''); // "Spent for what?"

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !description) {
      Alert.alert('Error', 'Please fill in all fields with valid data.');
      return;
    }

    // Create the new sub-expense object
    const newExpense = {
      id: new Date().toISOString() + Math.random(),
      description: description,
      amount: Number(amount),
      date: new Date().toISOString(),
    };

    try {
      // 1. Load the *entire* list of transactions
      const jsonValue = await AsyncStorage.getItem(storageKey);
      let allTransactions = jsonValue ? JSON.parse(jsonValue) : [];

      // 2. Find the specific "Received" transaction we are editing
      const transactionIndex = allTransactions.findIndex(t => t.id === transactionId);
      
      if (transactionIndex > -1) {
        // 3. Add this new expense to its internal 'expenses' list
        allTransactions[transactionIndex].expenses.push(newExpense);
        
        // 4. Save the *entire* list back to storage
        await AsyncStorage.setItem(storageKey, JSON.stringify(allTransactions));
        
        console.log('Sub-expense saved!');
        navigation.goBack(); // Close the modal
      } else {
        Alert.alert('Error', 'Could not find parent transaction.');
      }
    } catch (e) {
      console.error('Failed to save sub-expense', e);
      Alert.alert('Error', 'Failed to save expense.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>How much was spent?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 2000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>What was it spent for?</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Groceries, Electric Bill"
        value={description}
        onChangeText={setDescription}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Save Expense" onPress={handleSave} />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  buttonContainer: {
    marginTop: 40,
  },
});
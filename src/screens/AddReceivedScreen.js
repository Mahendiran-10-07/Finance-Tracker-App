// src/screens/AddReceivedScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddReceivedScreen({ navigation }) {
  const [account, setAccount] = useState('Mahis account');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  // --- This is the save logic with new logging ---
  const handleSave = async () => {
    // Basic validation
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }

    // 1. Create the new transaction object
    const newTransaction = {
      id: date.toISOString() + Math.random(), // Create a unique ID
      account: account,
      amount: Number(amount),
      date: date.toISOString(),
      type: 'received',
      notes: '', // Add notes field as requested
      expenses: [], // <-- THIS IS THE NEW LINE YOU ADDED
    };

    try {
      // 2. Load existing transactions
      const existingTransactions = await AsyncStorage.getItem('@received_transactions');
      console.log('--- ADD SCREEN ---');
      console.log('Loaded existing data:', existingTransactions);
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];

      // 3. Add the new one
      transactions.push(newTransaction);
      console.log('New transaction list to save:', transactions);

      // 4. Save the updated list
      await AsyncStorage.setItem('@received_transactions', JSON.stringify(transactions));

      console.log('Transaction saved!');
      navigation.goBack(); // Close the modal
    } catch (e) {
      console.error('Failed to save transaction', e);
      Alert.alert('Error', 'Failed to save transaction.');
    }
  };
  // --- End of new logic ---

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Account:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={account}
          onValueChange={(itemValue) => setAccount(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Mahis account" value="Mahis account" />
          <Picker.Item label="Manis account" value="Manis account" />
          <Picker.Item label="Amma account" value="Amma account" />
          <Picker.Item label="Appa account" value="Appa account" />
        </Picker>
      </View>

      <Text style={styles.label}>Enter Amount (in Rupees):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 5000"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>Select Date & Time:</Text>
      <Button title={date.toLocaleString()} onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <View style={styles.buttonContainer}>
        <Button title="Save Transaction" onPress={handleSave} />
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
  pickerContainer: { // <-- This is your fixed style from the APK bug
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 5,
    marginBottom: 20,
  },
  picker: {
    // height: 50, // <-- Removed this
    width: '100%',
    minHeight: 50,
    backgroundColor: Platform.OS === 'ios' ? COLORS.lightGray : 'white',
  },
  buttonContainer: {
    marginTop: 40,
  },
});
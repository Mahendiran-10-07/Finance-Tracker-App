// src/screens/AddSpentScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, Alert } from 'react-native';
import { COLORS } from '../constants/colors';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddSpentScreen({ navigation }) {
  const [account, setAccount] = useState(''); // This is a text input
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState(''); // "To Whom"
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = (selectedDate) => {
    setDate(selectedDate);
    hideDatePicker();
  };

  const handleSave = async () => {
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0 || !account || !recipient) {
      Alert.alert('Error', 'Please fill in all fields with valid data.');
      return;
    }

    const newTransaction = {
      id: date.toISOString() + Math.random(),
      account: account, // "From which account"
      amount: Number(amount),
      recipient: recipient, // "To whom"
      date: date.toISOString(),
      type: 'spent',
      notes: '',
    };

    try {
      // We use a NEW storage key: '@spent_transactions'
      const existingTransactions = await AsyncStorage.getItem('@spent_transactions');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.push(newTransaction);
      await AsyncStorage.setItem('@spent_transactions', JSON.stringify(transactions));

      console.log('Spent transaction saved!');
      navigation.goBack();
    } catch (e) {
      console.error('Failed to save spent transaction', e);
      Alert.alert('Error', 'Failed to save transaction.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter Amount (in Rupees):</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., 500"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
      />

      <Text style={styles.label}>From Which Account:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Amma account"
        value={account}
        onChangeText={setAccount}
      />
      
      <Text style={styles.label}>To Whom:</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g., Groceries, Electric Bill"
        value={recipient}
        onChangeText={setRecipient}
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

// --- Styles (Same as AddReceivedScreen) ---
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
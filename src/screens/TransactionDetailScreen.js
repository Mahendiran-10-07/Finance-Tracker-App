// src/screens/TransactionDetailScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Alert,
  ScrollView,
  FlatList, // <-- NEW: Import FlatList
  TouchableOpacity, // <-- NEW: Import TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useIsFocused } from '@react-navigation/native'; // <-- NEW: Import hooks

// --- NEW: A small component just for the sub-expense list items ---
const ExpenseItem = ({ item }) => (
  <View style={styles.expenseItem}>
    <View>
      <Text style={styles.expenseDesc}>{item.description}</Text>
      <Text style={styles.expenseDate}>
        {new Date(item.date).toLocaleDateString()}
      </Text>
    </View>
    <Text style={styles.expenseAmount}>-₹{item.amount}</Text>
  </View>
);

export default function TransactionDetailScreen({ route }) {
  const navigation = useNavigation(); // <-- NEW: Get navigation
  const isFocused = useIsFocused(); // <-- NEW: Check if screen is focused
  const { transactionId, storageKey } = route.params;

  const [transaction, setTransaction] = useState(null);
  const [notes, setNotes] = useState('');

  // --- NEW: State for our balance calculations ---
  const [totalSpent, setTotalSpent] = useState(0);
  const [balance, setBalance] = useState(0);

  // --- UPDATED: Load transaction (now wrapped in useCallback) ---
  const loadTransaction = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      const allTransactions = jsonValue ? JSON.parse(jsonValue) : [];
      const foundTransaction = allTransactions.find((t) => t.id === transactionId);

      if (foundTransaction) {
        setTransaction(foundTransaction);
        setNotes(foundTransaction.notes || '');

        // --- NEW: Calculate balance if it's a "received" transaction ---
        if (foundTransaction.type === 'received') {
          let spent = 0;
          if (foundTransaction.expenses && foundTransaction.expenses.length > 0) {
            spent = foundTransaction.expenses.reduce((sum, exp) => sum + exp.amount, 0);
          }
          setTotalSpent(spent);
          setBalance(foundTransaction.amount - spent);
        }
      } else {
        Alert.alert('Error', 'Transaction not found. It may have been deleted.');
        navigation.goBack();
      }
    } catch (e) {
      console.error('Failed to load transaction', e);
    }
  }, [transactionId, storageKey, navigation]);

  // --- NEW: useEffect to reload data when the screen is focused ---
  useEffect(() => {
    if (isFocused) {
      console.log('Detail screen focused, reloading data...');
      loadTransaction();
    }
  }, [isFocused, loadTransaction]);

  // --- (Your Save and Delete functions are mostly the same) ---
  const handleSaveNotes = async () => { /* ... (same as before) ... */ };
  const handleDelete = async () => { /* ... (same as before) ... */ };
  const confirmDelete = () => { /* ... (same as before) ... */ };

  // --- (Copy/Paste your existing functions here) ---
  const old_handleSaveNotes = async () => {
    if (!transaction) return;
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      const allTransactions = jsonValue != null ? JSON.parse(jsonValue) : [];
      const index = allTransactions.findIndex((t) => t.id === transaction.id);
      if (index > -1) {
        allTransactions[index].notes = notes;
        await AsyncStorage.setItem(storageKey, JSON.stringify(allTransactions));
        Alert.alert('Success', 'Notes saved!');
        navigation.goBack();
      }
    } catch (e) { console.error('Failed to save notes', e); Alert.alert('Error', 'Failed to save notes.'); }
  };

  const old_handleDelete = async () => {
    if (!transaction) return;
    try {
      const jsonValue = await AsyncStorage.getItem(storageKey);
      const allTransactions = jsonValue != null ? JSON.parse(jsonValue) : [];
      const filteredTransactions = allTransactions.filter((t) => t.id !== transaction.id);
      await AsyncStorage.setItem(storageKey, JSON.stringify(filteredTransactions));
      Alert.alert('Success', 'Transaction deleted!');
      navigation.goBack();
    } catch (e) { console.error('Failed to delete transaction', e); Alert.alert('Error', 'Failed to delete transaction.'); }
  };

  const old_confirmDelete = () => {
    Alert.alert(
      'Delete Transaction', 'Are you sure you want to delete this transaction?',
      [{ text: 'Cancel', style: 'cancel' },{ text: 'Delete', onPress: old_handleDelete, style: 'destructive' },],
      { cancelable: true }
    );
  };
  // --- (End of copy/paste) ---


  // --- NEW: Function to open the "Add Sub-Expense" modal ---
  const openAddExpenseModal = () => {
    navigation.navigate('AddSubExpense', {
      transactionId: transaction.id,
      storageKey: storageKey,
    });
  };

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  // --- RENDER ---
  return (
    <ScrollView style={styles.container}>
      {/* --- Main Details --- */}
      <Text style={styles.label}>Account:</Text>
      <Text style={styles.value}>{transaction.account}</Text>

      <Text style={styles.label}>Amount:</Text>
      <Text style={styles.value}>₹{transaction.amount}</Text>

      {transaction.type === 'spent' && (
        <>
          <Text style={styles.label}>To Whom:</Text>
          <Text style={styles.value}>{transaction.recipient}</Text>
        </>
      )}

      <Text style={styles.label}>Date:</Text>
      <Text style={styles.value}>
        {new Date(transaction.date).toLocaleString('en-US', {
          dateStyle: 'full', timeStyle: 'medium',
        })}
      </Text>

      {/* // =======================================================
      // --- NEW FEATURE: BALANCE & SUB-EXPENSE TRACKING ---
      // This only shows for "received" transactions
      // =======================================================
      */}
      {transaction.type === 'received' && (
        <>
          {/* --- 1. The Balance Summary --- */}
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Received:</Text>
              <Text style={styles.summaryAmount}>₹{transaction.amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Spent (from this):</Text>
              <Text style={styles.summaryAmountSpent}>-₹{totalSpent}</Text>
            </View>
            <View style={styles.balanceRow}>
              <Text style={styles.balanceLabel}>Current Balance:</Text>
              <Text style={styles.balanceAmount}>₹{balance}</Text>
            </View>
          </View>

          {/* --- 2. The "Add Spent" Button --- */}
          <TouchableOpacity style={styles.addSpentButton} onPress={openAddExpenseModal}>
            <Ionicons name="add-circle-outline" size={22} color={COLORS.white} />
            <Text style={styles.addSpentButtonText}>Add Spent (from this)</Text>
          </TouchableOpacity>

          {/* --- 3. The Sub-Expense List --- */}
          <Text style={styles.label}>Linked Expenses:</Text>
          {transaction.expenses && transaction.expenses.length > 0 ? (
            <FlatList
              data={transaction.expenses.sort((a, b) => new Date(b.date) - new Date(a.date))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <ExpenseItem item={item} />}
              scrollEnabled={false} // So it scrolls with the main page
            />
          ) : (
            <Text style={styles.noExpensesText}>No expenses linked to this transaction yet.</Text>
          )}
        </>
      )}

      {/* --- Notes Section (Same as before) --- */}
      <Text style={styles.label}>Notes:</Text>
      <TextInput
        style={styles.notesInput}
        placeholder="Add your notes here..."
        multiline
        value={notes}
        onChangeText={setNotes}
      />

      {/* --- Button Section (Same as before) --- */}
      <View style={styles.buttonContainer}>
        <Button title="Save Notes" onPress={old_handleSaveNotes} />
      </View>
      <View style={styles.deleteButtonContainer}>
        <Button title="Delete Transaction" onPress={old_confirmDelete} color={COLORS.primary} />
      </View>
    </ScrollView>
  );
}

// --- NEW AND UPDATED STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.darkGray,
    marginTop: 20,
  },
  value: {
    fontSize: 20,
    color: COLORS.secondary,
    marginBottom: 10,
  },
  
  // --- New Summary Styles ---
  summaryContainer: {
    marginTop: 20,
    backgroundColor: COLORS.lightGray,
    borderRadius: 8,
    padding: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    flex: 1, 
    marginRight: 10,
  },
  summaryAmount: {
    fontSize: 16,
    color: '#2E7D32', // Green
    fontWeight: 'bold',
  },
  summaryAmountSpent: {
    fontSize: 16,
    color: COLORS.primary, // Red
    fontWeight: 'bold',
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: COLORS.darkGray,
  },
  balanceLabel: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },
  balanceAmount: {
    fontSize: 18,
    color: COLORS.secondary,
    fontWeight: 'bold',
  },

  // --- New Button Style ---
  addSpentButton: {
    backgroundColor: COLORS.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  addSpentButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },

  // --- New Sub-Expense List Styles ---
  expenseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: COLORS.lightGray,
  },
  expenseDesc: {
    fontSize: 16,
    color: COLORS.text,
  },
  expenseDate: {
    fontSize: 12,
    color: COLORS.darkGray,
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary, // Red
  },
  noExpensesText: {
    marginTop: 10,
    fontStyle: 'italic',
    color: COLORS.darkGray,
    textAlign: 'center',
  },

  // --- Original Notes/Delete Styles ---
  notesInput: {
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginTop: 10,
    height: 150,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    marginTop: 30,
    marginBottom: 20,
  },
  deleteButtonContainer: {
    marginTop: 10,
    marginBottom: 50,
  },
});
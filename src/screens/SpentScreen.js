// src/screens/SpentScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionCard from '../components/TransactionCard'; // We'll re-use the same card

export default function SpentScreen() {
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const STORAGE_KEY = '@spent_transactions'; // <-- Define storage key

  // Function to load data
  const loadTransactions = useCallback(async () => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      const data = jsonValue != null ? JSON.parse(jsonValue) : [];
      data.sort((a, b) => new Date(b.date) - new Date(a.date));
      setTransactions(data);
    } catch (e) {
      console.error('Failed to load spent transactions', e);
    }
  }, []);

  // useEffect hook to refresh list on focus
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      loadTransactions();
    });
    return unsubscribe;
  }, [navigation, loadTransactions]);

  // Function to open the 'AddSpent' modal
  const openAddModal = () => {
    navigation.navigate('AddSpent');
  };

  // --- NEW: Function to handle card tap ---
  const handleCardPress = (transaction) => {
    navigation.navigate('TransactionDetail', {
      transactionId: transaction.id,
      storageKey: STORAGE_KEY, // Tell the detail screen which storage to use
    });
  };

  return (
    <View style={styles.container}>
      {transactions.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No transactions yet.</Text>
          <Text style={styles.emptySubText}>Tap the '+' button to add one!</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id}
          // --- UPDATED THIS PART ---
          renderItem={({ item }) => (
            <TransactionCard
              transaction={item}
              onPress={() => handleCardPress(item)} // Pass the onPress function
            />
          )}
          // --- END OF UPDATE ---
          style={styles.list}
          extraData={transactions}
        />
      )}

      {/* '+' button */}
      <TouchableOpacity style={styles.fab} onPress={openAddModal}>
        <Ionicons name="add" size={30} color={COLORS.white} />
      </TouchableOpacity>
    </View>
  );
}

// --- Styles (Same as before) ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
  },
  list: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.darkGray,
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 30,
    backgroundColor: COLORS.primary,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
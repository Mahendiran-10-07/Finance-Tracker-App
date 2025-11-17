// src/components/TransactionCard.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'; // <-- Import TouchableOpacity
import { COLORS } from '../constants/colors';

// The component now accepts an 'onPress' function as a prop
export default function TransactionCard({ transaction, onPress }) {
  
  // Format the date to be more readable
  const formattedDate = new Date(transaction.date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
  
  // Check if this is a "spent" transaction
  const isSpent = transaction.type === 'spent';

  return (
    // Wrap the card in a TouchableOpacity
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.leftColumn}>
        {/* If spent, show "To Whom". If received, show "Account". */}
        <Text style={styles.account}>
          {isSpent ? transaction.recipient : transaction.account}
        </Text>
        
        {/* If spent, show "From Account". If received, show the date. */}
        <Text style={styles.subtitle}>
          {isSpent ? `From: ${transaction.account}` : formattedDate}
        </Text>
      </View>
      
      <View style={styles.rightColumn}>
        {/* Make the amount Red for spent, Green for received */}
        <Text style={[styles.amount, isSpent ? styles.amountSpent : styles.amountReceived]}>
          {isSpent ? '-' : '+'}₹{transaction.amount}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leftColumn: {
    flex: 1,
    marginRight: 10,
  },
  rightColumn: {
    // No changes
  },
  account: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary, // Blue
  },
  subtitle: { // <-- Renamed from 'date'
    fontSize: 14,
    color: COLORS.darkGray,
    marginTop: 4,
  },
  amount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  amountReceived: { // <-- New style for received
    color: '#2E7D32', // Dark green
  },
  amountSpent: { // <-- New style for spent
    color: '#C62828', // Dark red
  },
});
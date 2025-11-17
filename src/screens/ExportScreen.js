// src/screens/ExportScreen.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Platform, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { generateExport } from '../utils/DataExporter'; // Import our updated util
import { COLORS } from '../constants/colors';

export default function ExportScreen({ navigation }) {
  // --- State for our form ---
  const [exportType, setExportType] = useState('received'); // 'received' or 'spent'
  
  // State for "Received" filter
  const [selectedAccount, setSelectedAccount] = useState('All'); // 'All', 'Mahis account', etc.

  // State for "Spent" filter
  const [startDate, setStartDate] = useState(new Date(2025, 0, 1)); // Default: start of year
  const [endDate, setEndDate] = useState(new Date()); // Default: today
  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  // --- Main Export Logic ---
  const handleExport = async () => {
    try {
      if (exportType === 'received') {
        // --- Handle RECEIVED export ---
        const jsonValue = await AsyncStorage.getItem('@received_transactions');
        let data = jsonValue ? JSON.parse(jsonValue) : [];

        // Apply account filter (if not 'All')
        if (selectedAccount !== 'All') {
          data = data.filter(t => t.account === selectedAccount);
        }
        
        // Generate the export
        await generateExport(data, `received_export_${selectedAccount}`);

      } else {
        // --- Handle SPENT export ---
        const jsonValue = await AsyncStorage.getItem('@spent_transactions');
        let data = jsonValue ? JSON.parse(jsonValue) : [];
        
        // Ensure start of day and end of day for accurate filtering
        const startOfDay = new Date(startDate.setHours(0, 0, 0, 0));
        const endOfDay = new Date(endDate.setHours(23, 59, 59, 999));

        // Apply date range filter
        data = data.filter(t => {
          const transactionDate = new Date(t.date);
          return transactionDate >= startOfDay && transactionDate <= endOfDay;
        });

        // Generate the export
        const filename = `spent_export_${startDate.toISOString().split('T')[0]}_to_${endDate.toISOString().split('T')[0]}`;
        await generateExport(data, filename);
      }

    } catch (e) {
      console.error('Export failed', e);
      Alert.alert('Error', 'An error occurred during the export.');
    }
  };

  // --- Render the UI ---
  return (
    <View style={styles.container}>
      <Text style={styles.label}>1. Select data to export:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={exportType}
          onValueChange={(itemValue) => setExportType(itemValue)}
        >
          <Picker.Item label="Received Transactions" value="received" />
          <Picker.Item label="Spent Transactions" value="spent" />
        </Picker>
      </View>

      <Text style={styles.label}>2. Apply filters:</Text>
      
      {/* --- CONDITIONAL UI: Show Received Filters --- */}
      {exportType === 'received' && (
        <View>
          <Text style={styles.filterLabel}>Filter by Account:</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={selectedAccount}
              onValueChange={(itemValue) => setSelectedAccount(itemValue)}
            >
              <Picker.Item label="All Accounts" value="All" />
              <Picker.Item label="Mahis account" value="Mahis account" />
              <Picker.Item label="Manis account" value="Manis account" />
              <Picker.Item label="Amma account" value="Amma account" />
              <Picker.Item label="Appa account" value="Appa account" />
            </Picker>
          </View>
        </View>
      )}

      {/* --- CONDITIONAL UI: Show Spent Filters --- */}
      {exportType === 'spent' && (
        <View>
          <Text style={styles.filterLabel}>Filter by Date Range:</Text>
          <Button title={`From: ${startDate.toLocaleDateString()}`} onPress={() => setStartDatePickerVisible(true)} />
          <View style={{ marginVertical: 8 }} />
          <Button title={`To: ${endDate.toLocaleDateString()}`} onPress={() => setEndDatePickerVisible(true)} />
          
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            date={startDate}
            onConfirm={(date) => { setStartDate(date); setStartDatePickerVisible(false); }}
            onCancel={() => setStartDatePickerVisible(false)}
          />
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            date={endDate}
            onConfirm={(date) => { setEndDate(date); setEndDatePickerVisible(false); }}
            onCancel={() => setEndDatePickerVisible(false)}
          />
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Generate & Export" onPress={handleExport} color={COLORS.secondary} />
      </View>
    </View>
  );
}

// --- Styles ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.secondary,
    marginTop: 10,
    marginBottom: 10,
  },
  filterLabel: {
    fontSize: 16,
    color: COLORS.darkGray,
    marginBottom: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: COLORS.darkGray,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 'auto', // Pushes the button to the bottom
    marginBottom: 40,
  },
});
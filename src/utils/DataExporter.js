// src/utils/DataExporter.js
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

// This function converts an array of objects into a CSV string
function convertToCSV(data) {
  if (data.length === 0) return '';
  
  // Get all unique keys from all objects to create headers
  const allKeys = new Set();
  data.forEach(row => Object.keys(row).forEach(key => allKeys.add(key)));
  const headers = Array.from(allKeys);
  
  let csv = headers.join(',') + '\n'; // Header row

  data.forEach((row) => {
    const rowValues = headers.map((header) => {
      let value = row[header];
      if (value === null || value === undefined) {
        value = '';
      }
      // Escape commas and quotes in values
      value = String(value).replace(/"/g, '""');
      if (String(value).includes(',')) {
        value = `"${value}"`;
      }
      return value;
    });
    csv += rowValues.join(',') + '\n';
  });

  return csv;
}

// --- UPDATED FUNCTION ---
// It now accepts data and a filename, instead of loading data itself
export const generateExport = async (dataToExport, filename) => {
  if (dataToExport.length === 0) {
    Alert.alert('No Data', 'There is no data matching your filters to export.');
    return;
  }

  try {
    // 1. Convert to CSV
    console.log('Converting data to CSV...');
    const csvData = convertToCSV(dataToExport);
    
    // 2. Save the file
    const fileUri = FileSystem.documentDirectory + `${filename}.csv`;
    await FileSystem.writeAsStringAsync(fileUri, csvData, {
      encoding: 'utf8',
    });
    console.log('File saved to:', fileUri);

    // 3. Check if sharing is available and share
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Share your transaction data',
      });
    } else {
      Alert.alert('Sharing Not Available', 'Sharing is not available on this device.');
    }

  } catch (e) {
    console.error('Failed to export data', e);
    Alert.alert('Error', 'An error occurred while exporting data.');
  }
};
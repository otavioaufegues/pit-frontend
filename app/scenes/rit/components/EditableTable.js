import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const EditableTable = ({ data, columns, onTableDataChange }) => {
  const handleCellChange = (rowIndex, columnIndex, value) => {
    const updatedTableData = [...data];
    updatedTableData[rowIndex][columnIndex] = value;
    onTableDataChange(updatedTableData);
  };

  const handleAddRow = () => {
    const newRow = Array(columns.length).fill('');
    const updatedTableData = [...data, newRow];
    onTableDataChange(updatedTableData);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.addRowButton} onPress={handleAddRow}>
        <Text style={styles.addRowButtonText}>Novo campo</Text>
      </TouchableOpacity>
      <View style={styles.tableHeader}>
        {columns.map((column, columnIndex) => (
          <Text key={columnIndex} style={styles.headerCell}>
            {column}
          </Text>
        ))}
      </View>
      <View style={styles.tableBody}>
        {data.map((rowData, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            {rowData.map((cellData, columnIndex) => (
              <TextInput
                key={columnIndex}
                style={styles.cellInput}
                value={cellData}
                onChangeText={(text) =>
                  handleCellChange(rowIndex, columnIndex, text)
                }
              />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 10,
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  cellInput: {
    flex: 1,
    padding: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  addRowButton: {
    backgroundColor: '#d48888',
    padding: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '40%',
    alignSelf: 'flex-end',
  },
  addRowButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EditableTable;
// .color1 { #b32c33 };
// .color2 { #d48888 };
// .color3 { #982e35 };
// .color4 { #876c6f };
// .color5 { #bcbcc3 };

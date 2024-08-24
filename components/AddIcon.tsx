import React from 'react';
import { View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useBookStore from '../stores/BookStore';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
const AddIcon = () => {
  const { addAllBooks } = useBookStore();
  const addBookList = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
    if (res.canceled === true || res.assets.length === 0) {
      return;
    }
    addAllBooks(res.assets);
    await FileSystem.copyAsync({
      from: res.assets[0].uri,
      to: FileSystem.documentDirectory + res.assets[0].name,
    });
  };
  return (
    <View>
      <MaterialIcons
        name='add'
        size={30}
        color='black'
        onPress={addBookList}
      />
    </View>
  );
};

export default AddIcon;

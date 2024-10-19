import React from 'react';
import { ToastAndroid, View } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useBookStore from '../stores/BookStore';
import * as DocumentPicker from 'expo-document-picker';
const AddIcon = () => {
  const { addAllBooks, books } = useBookStore();
  const addBookList = async () => {
    const res = await DocumentPicker.getDocumentAsync({ type: 'text/plain' });
    if (res.canceled === true || res.assets.length === 0) {
      ToastAndroid.show('导入中止', ToastAndroid.SHORT);
      return;
    }
    if (
      books.filter(
        (item) =>
          item.name === res.assets[0].name && item.size === res.assets[0].size,
      ).length !== 0
    ) {
      ToastAndroid.show('书籍已存在', ToastAndroid.SHORT);
      return;
    }
    addAllBooks(res.assets);
  };
  return (
    <View>
      <MaterialIcons name="add" size={30} color="black" onPress={addBookList} />
    </View>
  );
};

export default AddIcon;

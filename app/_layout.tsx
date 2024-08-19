import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchIcon from '../components/SearchIcon';
import AddIcon from '../components/AddIcon';
import * as FileSystem from 'expo-file-system';
import useBookStore from '../stores/BookStore';
const Layout = () => {
  const { addAllBooks } = useBookStore();
  useEffect(() => {
    const readAllBooks = async () => {
      if (FileSystem.documentDirectory === null) {
        return;
      }
      const data = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const books = data.filter((item) => item.endsWith('.txt'));
      addAllBooks(books);
    };
    readAllBooks();
  }, []);
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          headerShadowVisible: false,
          headerTitle: () => {
            return <Text>正在阅读</Text>;
          },
          headerRight: () => {
            return (
              <View style={styles.icnoLine}>
                <SearchIcon />
                <AddIcon />
              </View>
            );
          },
        }}
      />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='book/[book]'
      />
    </Stack>
  );
};

const styles = StyleSheet.create({
  icnoLine: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 15,
  },
});

export default Layout;

import { Stack } from 'expo-router/stack';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SearchIcon from '../components/SearchIcon';
import AddIcon from '../components/AddIcon';
const Layout = () => {
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

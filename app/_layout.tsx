import { Stack } from 'expo-router';
import React from 'react';
import { Text } from 'react-native';
const Layout = () => {
  return (
    <Stack>
      <Stack.Screen
        name='index'
        options={{
          navigationBarHidden: true,
          statusBarHidden: true,
          headerShadowVisible: false,
          headerTitle: (props) => {
            return <Text>正在阅读</Text>;
          },
        }}
      />
      <Stack.Screen
        options={{
          statusBarHidden: true,
          navigationBarHidden: true,
          headerShown: false,
        }}
        name='book/[book]'
      />
    </Stack>
  );
};

export default Layout;

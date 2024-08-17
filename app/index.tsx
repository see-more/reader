import { FlashList } from '@shopify/flash-list';
import { Link, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function Index() {
  const bookName = '满堂';
  return (
    <View style={styles.container}>
      <Pressable
        onPress={() =>
          router.push({
            pathname: 'book/[book]',
            params: {
              bookName,
            },
          })
        }
      >
        <Text>跳转</Text>
      </Pressable>
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { Link } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.message}>页面未找到</Text>
      <Link href='/' style={styles.link}>
        返回首页
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
  message: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
  },
  link: {
    marginTop: 20,
    fontSize: 16,
    color: '#007AFF',
  },
});

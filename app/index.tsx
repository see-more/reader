import { FlashList } from '@shopify/flash-list';
import { StatusBar } from 'expo-status-bar';
import {
  Pressable,
  StyleSheet,
  useWindowDimensions,
  View,
  Text,
} from 'react-native';
import useBookStore from '../stores/BookStore';
import BookCover from '../components/BookCover';
import { router } from 'expo-router';

export default function Index() {
  const { height, width } = useWindowDimensions();
  const { books } = useBookStore();
  return (
    <View style={styles.container}>
      {books.length ? (
        <FlashList
          data={books}
          estimatedItemSize={200}
          numColumns={3}
          renderItem={({ item }) => {
            return (
              <Pressable
                onPress={() =>
                  router.push({
                    pathname: 'book/[book]',
                    params: {
                      bookName: item,
                    },
                  })
                }
                style={{ flex: 1 }}
              >
                <BookCover
                  height={height}
                  width={width}
                  bookname={item.split('.')[0]}
                />
              </Pressable>
            );
          }}
          keyExtractor={(item) => {
            return item;
          }}
        />
      ) : (
        <Text style={styles.emptyContainer}>这里空空如也</Text>
      )}
      <StatusBar style='auto' />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  emptyContainer: {
    display: 'flex',
    flex: 1,
    fontSize: 45,
    fontWeight: '300',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

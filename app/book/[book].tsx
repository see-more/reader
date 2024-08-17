import { useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { Text } from 'react-native';
const Book = () => {
  const { bookName } = useLocalSearchParams<{ bookName: string }>();

  useEffect(() => {}, []);
  return (
    <>
      {bookName ? (
        <>
          <Text>{bookName}</Text>
        </>
      ) : (
        <Text>bookname</Text>
      )}
    </>
  );
};

export default Book;

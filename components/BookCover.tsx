import React from 'react';
import { Text, View, type GestureResponderEvent } from 'react-native';
const BookCover = ({
  height,
  width,
  bookname,
}: {
  height: number;
  width: number;
  bookname?: string;
}) => {
  const touch = (_e: GestureResponderEvent) => {};
  return (
    <View
      onTouchEnd={touch}
      style={{
        flex: 1,
        height: height / 4.5,
        marginHorizontal: width / 50,
        marginVertical: height / 100,
        overflow: 'hidden',
      }}
    >
      <View
        style={{
          display: 'flex',
          flex: 5,
          backgroundColor: '#f2f5f4',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Text>{bookname || '小说'}</Text>
      </View>
      <Text
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        {bookname || '小说'}
      </Text>
    </View>
  );
};

export default BookCover;

import {
  Button,
  SafeAreaView,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Book } from '../../models/Book';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Canvas, Glyphs, useFont } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { caculateBook } from '../../utils/caculateBook';

const BookReader = () => {
  const { bookName } = useLocalSearchParams<{ bookName: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentChacpter, setCurrentchapter] = useState(0);
  useEffect(() => {
    const readFile = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(
          FileSystem.documentDirectory + bookName
        );
        setBook(new Book(fileContent));
      } catch (err) {
        console.error(err);
      }
    };
    readFile();
  }, []);
  const fontSize = 25;
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const maxLines = Math.floor((height - top) / fontSize);
  const maxChar = Math.floor(width / fontSize);
  const font = useFont(
    require('../../assets/fonts/FangZhengYouHeiJianTi-1.ttf'),
    fontSize
  );
  if (font === null) {
    return null;
  }
  const { getGlyphIDs } = font;
  const glyphs = caculateBook(
    book!,
    getGlyphIDs,
    maxChar,
    maxLines,
    fontSize,
    top ? top : 30
  );
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Canvas style={{ flex: 1 }}>
        <Glyphs
          font={font}
          glyphs={glyphs[currentChacpter].allchacpterPoints[currentPage]}
        />
      </Canvas>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between',
          position: 'absolute',
          bottom: 10,
        }}
      >
        <Button
          title='上一页'
          onPress={() => {
            if (currentPage != 0) {
              setCurrentPage((currentPage) => currentPage - 1);
            } else {
              if (currentChacpter === 0) {
                return;
              } else {
                setCurrentchapter((currentChacpter) => currentChacpter - 1);
                setCurrentPage(
                  glyphs[currentChacpter].allchacpterPoints.length
                );
              }
            }
          }}
        />
        <Text>章节 {currentChacpter + 1}</Text>
        <Text>页面 {currentPage + 1}</Text>
        <Text>总章节 {glyphs.length}</Text>
        <Text>总页面 {glyphs[currentChacpter].allchacpterPoints.length}</Text>
        <Button
          title='下一页'
          onPress={() => {
            if (
              currentPage <
              glyphs[currentChacpter].allchacpterPoints.length - 1
            ) {
              setCurrentPage((currentPage) => currentPage + 1);
            } else {
              if (currentChacpter < glyphs.length - 1) {
                setCurrentPage(0);
                setCurrentchapter((currentChacpter) => currentChacpter + 1);
              } else {
                return;
              }
            }
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default BookReader;

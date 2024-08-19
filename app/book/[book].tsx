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
import React, { useEffect, useMemo, useState } from 'react';
import { Canvas, Glyphs, useFont } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { caculateBook } from '../../utils/caculateBook';
import AntDesign from '@expo/vector-icons/AntDesign';
const BookReader = () => {
  const { bookName } = useLocalSearchParams<{ bookName: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentChacpter, setCurrentchapter] = useState(0);
  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
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
  const fontSize = 22;
  const maxLines = Math.floor((height - top) / fontSize);
  const maxChar = Math.floor(width / fontSize);
  const font = useFont(
    require('../../assets/fonts/FangZhengYouHeiJianTi-1.ttf'),
    fontSize
  );
  const glyphs = useMemo(() => {
    return caculateBook(
      book!,
      font,
      maxChar,
      maxLines,
      fontSize,
      top ? top : 30
    );
  }, [book, font]);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {glyphs && glyphs.length ? (
        <>
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
                if (glyphs.length != 0) {
                  if (currentChacpter === 0 && currentPage === 0) {
                    return;
                  }
                  if (currentPage === 0) {
                    const preChacpter = currentChacpter - 1;
                    setCurrentchapter((currentChacpter) => currentChacpter - 1);
                    setCurrentPage(
                      glyphs[preChacpter].allchacpterPoints.length - 1
                    );
                  } else {
                    setCurrentPage(currentPage - 1);
                  }
                }
              }}
            />
            <Text>章节 {currentChacpter + 1}</Text>
            <Text>页面 {currentPage + 1}</Text>
            <Text>总章节 {glyphs.length}</Text>
            <Text>
              总页面 {glyphs[currentChacpter].allchacpterPoints.length}
            </Text>
            <Button
              title='下一页'
              onPress={() => {
                if (
                  currentChacpter === glyphs.length - 1 &&
                  currentPage ===
                    glyphs[currentChacpter].allchacpterPoints.length - 1
                ) {
                  return;
                }
                if (
                  currentPage ===
                  glyphs[currentChacpter].allchacpterPoints.length - 1
                ) {
                  setCurrentPage(0);
                  setCurrentchapter(currentChacpter + 1);
                } else {
                  setCurrentPage(currentPage + 1);
                }
              }}
            />
          </View>
        </>
      ) : (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <AntDesign
            name='loading1'
            size={24}
            color='black'
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default BookReader;

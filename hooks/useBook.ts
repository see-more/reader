import { useEffect, useState } from 'react';
import { Book } from '../models/Book';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { bookPoints, caculateBook } from '../utils/caculateBook';
import { SkFont } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system';

export const useBook = ({
  bookName,
  font,
}: {
  bookName: string;
  font: SkFont;
}): {
  glyphs: Array<bookPoints>;
  currentPage: number;
  currentChacpter: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentchapter: React.Dispatch<React.SetStateAction<number>>;
} => {
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

  const { getGlyphIDs } = font;
  const glyphs = caculateBook(
    book!,
    getGlyphIDs,
    maxChar,
    maxLines,
    fontSize,
    top ? top : 30
  );
  return {
    glyphs,
    currentPage,
    currentChacpter,
    setCurrentPage,
    setCurrentchapter,
  };
};

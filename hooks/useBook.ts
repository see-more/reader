import { useEffect, useState, useMemo } from 'react';
import { Book } from '../models/Book';
import { useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookPoints, calculateBook } from '../utils/calculateBook';
import { SkFont } from '@shopify/react-native-skia';
import * as FileSystem from 'expo-file-system';

const getDocumentDirectory = (): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (FileSystem as any).documentDirectory || '';
};

export const useBook = ({
  bookName,
  font,
}: {
  bookName: string;
  font: SkFont | null;
}): {
  bookPoints: BookPoints | null;
  currentPage: number;
  currentChapter: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  setCurrentChapter: React.Dispatch<React.SetStateAction<number>>;
} => {
  const [book, setBook] = useState<Book | null>(null);
  const [fullText, setFullText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);

  useEffect(() => {
    const readFile = async () => {
      try {
        const fileContent = await FileSystem.readAsStringAsync(
          getDocumentDirectory() + bookName,
        );
        const newBook = new Book(fileContent);
        setBook(newBook);
        setFullText(fileContent);
      } catch (err) {
        console.error(err);
      }
    };
    readFile();
  }, [bookName]);

  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();
  const fontSize = 25;
  const maxLines = Math.floor((height - top) / fontSize);
  const maxChar = Math.floor(width / fontSize);

  // 生成唯一书籍ID
  const bookId = useMemo(() => bookName?.replace(/[^a-zA-Z0-9]/g, '_') || 'unknown', [bookName]);

  // 计算书籍分页
  const bookPoints = useMemo(() => {
    if (!book || !font || !fullText) {
      return null;
    }
    return calculateBook(book, fullText, bookId, {
      font,
      maxChar,
      maxLines,
      fontSize,
      top: top ? top : 30,
      preloadAhead: 1,
      preloadBehind: 1,
    });
  }, [book, font, fullText, bookId, maxChar, maxLines, fontSize, top]);

  return {
    bookPoints,
    currentPage,
    currentChapter,
    setCurrentPage,
    setCurrentChapter,
  };
};

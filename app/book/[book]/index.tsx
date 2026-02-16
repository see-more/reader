import { SafeAreaView, useWindowDimensions, View, ActivityIndicator, Text } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { Book } from '../../models/Book';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { Canvas, Glyphs, useFont } from '@shopify/react-native-skia';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookPoints, calculateBook, preloadChapter, clearPageCache, getCacheSize } from '../../utils/calculateBook';

const BookReader = () => {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const [fullText, setFullText] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(0);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { width, height } = useWindowDimensions();
  const { top } = useSafeAreaInsets();

  const fontSize = 22;
  const maxLines = Math.floor((height - top - 100) / fontSize); // 减去底部进度条
  const maxChar = Math.floor(width / fontSize);

  // 生成唯一书籍ID
  const bookId = useMemo(() => uri?.split('/').pop() || 'unknown', [uri]);

  // 加载书籍
  useEffect(() => {
    let isMounted = true;

    const readFile = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const fileContent = await FileSystem.readAsStringAsync(uri);
        
        if (!isMounted) return;

        // 先只解析章节结构，不解析内容
        const newBook = new Book(fileContent);

        // 异步加载内容
        setBook(newBook);
        setFullText(fileContent);
        setIsLoading(false);
      } catch (err) {
        if (isMounted) {
          console.error(err);
          setError('加载书籍失败');
          setIsLoading(false);
        }
      }
    };

    readFile();

    // 清理缓存
    return () => {
      isMounted = false;
    };
  }, [uri]);

  // 懒加载分页
  const bookPoints: BookPoints | null = useMemo(() => {
    if (!book || !fullText || !font) return null;

    return calculateBook(book, fullText, bookId, {
      font,
      maxChar,
      maxLines,
      fontSize,
      top: top || 30,
      preloadAhead: 1,  // 预加载下一章
      preloadBehind: 1,  // 预加载上一章
    });
  }, [book, fullText, font, maxChar, maxLines, top, bookId]);

  const font = useFont(require('@/assets/fonts/FangZhengYouHeiJianTi-1.ttf'), fontSize);

  // 获取当前页字形
  const currentGlyphs = useMemo(() => {
    if (!bookPoints || bookPoints.chapterPoints.length === 0) return null;

    const chapterData = bookPoints.chapterPoints.find(
      (c) => c.chapterIndex === currentChapter
    );

    if (!chapterData || !chapterData.pages[currentPage]) return null;

    return chapterData.pages[currentPage];
  }, [bookPoints, currentChapter, currentPage]);

  // 计算总页数
  const totalPages = useMemo(() => {
    if (!bookPoints) return 0;
    return bookPoints.chapterPoints.reduce((sum, c) => sum + c.pages.length, 0);
  }, [bookPoints]);

  // 翻页处理
  const goToNextPage = useCallback(() => {
    if (!bookPoints) return;

    const chapterData = bookPoints.chapterPoints.find(
      (c) => c.chapterIndex === currentChapter
    );

    if (!chapterData) return;

    const chapterPages = chapterData.pages;

    if (currentPage < chapterPages.length - 1) {
      // 本章下一页
      setCurrentPage(currentPage + 1);
    } else if (currentChapter < bookPoints.chapterPoints.length - 1) {
      // 下一章
      setCurrentChapter(currentChapter + 1);
      setCurrentPage(0);

      // 预加载后续章节
      if (fullText && font) {
        for (let i = 1; i <= 2; i++) {
          preloadChapter(book!, fullText, bookId, {
            font,
            maxChar,
            maxLines,
            fontSize,
            top: top || 30,
          });
        }
      }
    }
  }, [bookPoints, currentChapter, currentPage, book, fullText, font]);

  const goToPrevPage = useCallback(() => {
    if (!bookPoints) return;

    if (currentPage > 0) {
      // 本章上一页
      setCurrentPage(currentPage - 1);
    } else if (currentChapter > 0) {
      // 上一章
      setCurrentChapter(currentChapter - 1);
      const prevChapterData = bookPoints.chapterPoints.find(
        (c) => c.chapterIndex === currentChapter - 1
      );
      if (prevChapterData) {
        setCurrentPage(prevChapterData.pages.length - 1);
      }
    }
  }, [bookPoints, currentChapter, currentPage]);

  // 页面切换回调
  useEffect(() => {
    if (bookPoints && totalPages > 0) {
      console.log(`缓存大小: ${getCacheSize()} 页`);
    }
  }, [totalPages, bookPoints]);

  // 加载状态
  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>加载中...</Text>
      </SafeAreaView>
    );
  }

  // 错误状态
  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{ flex: 1 }}
      onTouchEnd={({ nativeEvent }) => {
        if (!currentGlyphs) return;

        // 点击左侧 30% -> 上一页
        if (nativeEvent.pageX < width * 0.3) {
          goToPrevPage();
        }
        // 点击右侧 30% -> 下一页
        else if (nativeEvent.pageX > width * 0.7) {
          goToNextPage();
        }
        // 中间区域可以显示菜单
      }}
    >
      {currentGlyphs && currentGlyphs.length > 0 ? (
        <Canvas style={{ flex: 1 }}>
          <Glyphs
            font={font}
            glyphs={currentGlyphs}
          />
        </Canvas>
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>暂无内容</Text>
        </View>
      )}

      {/* 底部进度条 */}
      <View style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        right: 20,
        backgroundColor: 'rgba(0,0,0,0.1)',
        padding: 10,
        borderRadius: 5,
      }}>
        <Text style={{ textAlign: 'center' }}>
          第 {currentChapter + 1} 章 · 第 {currentPage + 1} 页
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default BookReader;

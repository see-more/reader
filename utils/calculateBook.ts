import { Book } from '../models/Book';
import { SkFont, SkPoint } from '@shopify/react-native-skia';

export interface BookPoints {
  chapterPoints: ChapterPoints[];
}

export interface ChapterPoints {
  chapterIndex: number;
  pages: PageGlyph[][];
}

export interface PageGlyph {
  id: number;
  pos: SkPoint;
}

export interface CalculateOptions {
  font: SkFont | null;
  maxChar: number;
  maxLines: number;
  fontSize: number;
  top: number;
  preloadAhead?: number; // 预加载后续章节数
  preloadBehind?: number; // 预加载前置章节数
}

// 分页缓存 - 带大小限制防止内存溢出
const pageCache = new Map<string, PageGlyph[][]>();
const MAX_CACHE_SIZE = 30; // 优化：减少缓存大小，只保留前后各1章
let cacheAccessOrder: string[] = [];
let cacheHits = 0;
let cacheMisses = 0;

// 优化：字形缓存 - 缓存常用字形避免重复计算
const glyphCache = new Map<string, number>();
const GLYPH_CACHE_SIZE = 1000;

// 优化：缓存键包含所有影响分页的参数
function getCacheKey(bookId: string, chapterIndex: number, maxChar: number, maxLines: number, fontSize: number, top: number): string {
  return `${bookId}_${chapterIndex}_${maxChar}_${maxLines}_${fontSize}_${top}`;
}

// LRU缓存淘汰
function addToCache(key: string, value: PageGlyph[][]): void {
  if (pageCache.size >= MAX_CACHE_SIZE) {
    const oldestKey = cacheAccessOrder.shift();
    if (oldestKey) {
      pageCache.delete(oldestKey);
    }
  }
  pageCache.set(key, value);
  cacheAccessOrder.push(key);
}

function getFromCache(key: string): PageGlyph[][] | undefined {
  const value = pageCache.get(key);
  if (value) {
    cacheHits++;
    // 更新访问顺序（移到最新）
    cacheAccessOrder = cacheAccessOrder.filter(k => k !== key);
    cacheAccessOrder.push(key);
  } else {
    cacheMisses++;
  }
  return value;
}

/**
 * 优化：批量获取字形ID（使用 Map 缓存）
 */
function getGlyphOptimized(font: SkFont, char: string): number {
  const cached = glyphCache.get(char);
  if (cached !== undefined) {
    return cached;
  }

  const glyphId = font.getGlyphIDs(char)[0] || 0;

  // LRU 缓存淘汰
  if (glyphCache.size >= GLYPH_CACHE_SIZE) {
    // 删除最早的条目（简单实现）
    const firstKey = glyphCache.keys().next().value;
    if (firstKey) {
      glyphCache.delete(firstKey);
    }
  }

  glyphCache.set(char, glyphId);
  return glyphId;
}

/**
 * 计算单章分页 (懒加载核心)
 * 优化：使用缓存获取字形，批量处理
 */
export const calculateChapter = (
  chapterContent: string[],
  _chapterIndex: number,
  font: SkFont | null,
  maxChar: number,
  maxLines: number,
  fontSize: number,
  top: number,
): PageGlyph[][] => {
  if (!font || !chapterContent.length) {
    return [];
  }

  const pages: PageGlyph[][] = [];
  let currentPage: PageGlyph[] = [];
  let line = 0;
  let column = 0;

  for (const paragraph of chapterContent) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;

    // 优化：逐字获取字形，使用缓存
    for (let i = 0; i < trimmedParagraph.length; i++) {
      const char = trimmedParagraph[i];
      if (!char) continue; // 添加 undefined 检查

      // 使用缓存优化的字形获取
      const id = getGlyphOptimized(font, char);
      if (id === 0) continue;

      // 添加字形
      currentPage.push({
        id,
        pos: { x: column * fontSize, y: top + line * fontSize },
      });

      // 更新光标
      if (column < maxChar - 1) {
        column++;
      } else {
        column = 0;
        line++;
      }

      // 换页
      if (line >= maxLines) {
        pages.push(currentPage);
        currentPage = [];
        line = 0;
      }
    }

    // 段落结束换行
    if (line > 0 && line < maxLines) {
      line++;
      column = 0;
    }

    // 页面已满
    if (line >= maxLines) {
      if (currentPage.length > 0) {
        pages.push(currentPage);
        currentPage = [];
      }
      line = 0;
      column = 0;
    }
  }

  // 最后一页
  if (currentPage.length > 0) {
    pages.push(currentPage);
  }

  return pages;
};

/**
 * 计算书籍分页 (支持懒加载)
 * 优化：更好的缓存管理和内存控制
 */
export const calculateBook = (
  book: Book,
  fullText: string,
  bookId: string,
  options: CalculateOptions,
): BookPoints => {
  const { font, maxChar, maxLines, fontSize, top, preloadAhead = 1, preloadBehind = 1 } = options;

  if (!font) {
    return { chapterPoints: [] };
  }

  const chapterCount = book.getChapterCount();
  const chapterPoints: ChapterPoints[] = [];

  // 当前阅读章节（假设从第0章开始）
  const currentChapterIndex = 0;

  // 计算预加载范围
  const startPreload = Math.max(0, currentChapterIndex - preloadBehind);
  const endPreload = Math.min(chapterCount - 1, currentChapterIndex + preloadAhead);

  // 只计算预加载范围内的章节
  for (let i = startPreload; i <= endPreload; i++) {
    // 优化：缓存键包含所有参数
    const cacheKey = getCacheKey(bookId, i, maxChar, maxLines, fontSize, top);

    // 检查缓存 - 优化：使用LRU方式查找
    const cachedPages = getFromCache(cacheKey);
    if (cachedPages) {
      chapterPoints.push({
        chapterIndex: i,
        pages: cachedPages,
      });
      continue;
    }

    // 懒加载章节内容
    const chapterContent = book.loadChapterContent(i, fullText);

    // 计算分页
    const pages = calculateChapter(
      chapterContent,
      i,
      font,
      maxChar,
      maxLines,
      fontSize,
      top,
    );

    // 缓存结果 - 优化：使用LRU缓存
    addToCache(cacheKey, pages);

    chapterPoints.push({
      chapterIndex: i,
      pages,
    });
  }

  return { chapterPoints };
};

/**
 * 预加载指定章节
 * 优化：添加参数验证
 */
export const preloadChapter = (
  book: Book,
  fullText: string,
  bookId: string,
  chapterIndex: number,
  options: CalculateOptions,
): void => {
  const { font, maxChar, maxLines, fontSize, top } = options;
  if (!font) return;

  // 优化：缓存键包含所有参数
  const cacheKey = getCacheKey(bookId, chapterIndex, maxChar, maxLines, fontSize, top);

  if (!getFromCache(cacheKey)) {
    const chapterContent = book.loadChapterContent(chapterIndex, fullText);
    const pages = calculateChapter(
      chapterContent,
      chapterIndex,
      font,
      maxChar,
      maxLines,
      fontSize,
      top,
    );
    addToCache(cacheKey, pages);
  }
};

/**
 * 清除分页缓存
 */
export const clearPageCache = (): void => {
  pageCache.clear();
  cacheAccessOrder = [];
  glyphCache.clear(); // 同时清除字形缓存
};

/**
 * 获取缓存大小
 */
export const getCacheSize = (): number => {
  return pageCache.size;
};

/**
 * 获取缓存统计信息（用于调试和监控）
 */
export const getCacheStats = (): {
  size: number;
  maxSize: number;
  hitRate: number;
  hits: number;
  misses: number;
} => {
  const total = cacheHits + cacheMisses;
  return {
    size: pageCache.size,
    maxSize: MAX_CACHE_SIZE,
    hitRate: total > 0 ? cacheHits / total : 0,
    hits: cacheHits,
    misses: cacheMisses,
  };
};

/**
 * 重置缓存统计
 */
export const resetCacheStats = (): void => {
  cacheHits = 0;
  cacheMisses = 0;
};

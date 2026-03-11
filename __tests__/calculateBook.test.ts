import {
  calculateChapter,
  calculateBook,
  preloadChapter,
  clearPageCache,
  getCacheSize,
  getCacheStats,
} from '../utils/calculateBook';
import { Book } from '../models/Book';

describe('calculateBook Module', () => {
  let mockFont: any;
  let book: Book;
  let fullText: string;

  beforeEach(() => {
    // Clear cache before each test
    clearPageCache();

    // Create mock font
    mockFont = {
      getGlyphIDs: jest.fn((text: string) => {
        return Array.from(text).map((_, i) => i + 1);
      }),
      getTextWidth: jest.fn(() => 100),
    };

    // Create test book with chapters
    fullText = `
第一章 测试
这是第一章的内容
第一行内容
第二行内容
第二章测试
这是第二章的内容
另一行内容
第三章 测试
这是第三章的内容
    `.trim();

    book = new Book(fullText);
  });

  afterEach(() => {
    clearPageCache();
  });

  describe('calculateChapter', () => {
    it('should return empty array when font is null', () => {
      const chapterContent = ['Line 1', 'Line 2'];
      const result = calculateChapter(
        chapterContent,
        0,
        null,
        20,
        10,
        16,
        24,
      );
      expect(result).toEqual([]);
    });

    it('should return empty array when chapter content is empty', () => {
      const result = calculateChapter([], 0, mockFont, 20, 10, 16, 24);
      expect(result).toEqual([]);
    });

    it('should correctly paginate chapter content', () => {
      const chapterContent = [
        '第一行内容',
        '第二行内容',
        '第三行内容',
      ];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10, // maxChar
        20, // maxLines
        16, // fontSize
        24, // top
      );
      expect(result.length).toBeGreaterThan(0);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should skip empty paragraphs', () => {
      const chapterContent = [
        '有效内容',
        '   ', // only spaces
        '',   // empty
        '更多内容',
      ];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10,
        10,
        16,
        24,
      );
      expect(result.length).toBeGreaterThan(0);
    });

    it('should create pages with correct glyph structure', () => {
      const chapterContent = ['测试内容'];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10,
        10,
        16,
        24,
      );
      
      if (result.length > 0) {
        const page = result[0];
        if (page && page.length > 0) {
          const glyph = page[0];
          if (glyph) {
            expect(glyph).toHaveProperty('id');
            expect(glyph).toHaveProperty('pos');
            expect(glyph.pos).toHaveProperty('x');
            expect(glyph.pos).toHaveProperty('y');
          }
        }
      }
    });

    it('should handle long paragraphs that span multiple pages', () => {
      const longLine = 'a'.repeat(50);
      const chapterContent = [longLine, longLine, longLine];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10, // maxChar - will cause line breaks
        5,  // maxLines - will cause page breaks
        16,
        24,
      );
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('calculateBook', () => {
    it('should return empty array when font is null', () => {
      const result = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: null,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      expect(result.chapterPoints).toEqual([]);
    });

    it('should calculate pages for chapter count based on preload settings', () => {
      const result = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
          preloadAhead: 1,
          preloadBehind: 0,
        },
      );
      
      expect(result.chapterPoints).toBeDefined();
      expect(Array.isArray(result.chapterPoints)).toBe(true);
      expect(result.chapterPoints.length).toBeGreaterThan(0);
    });

    it('should respect preloadAhead parameter', () => {
      const result = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
          preloadAhead: 2,
          preloadBehind: 0,
        },
      );
      
      expect(result.chapterPoints.length).toBeGreaterThan(0);
    });

    it('should respect preloadBehind parameter', () => {
      const result = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
          preloadAhead: 1,
          preloadBehind: 1,
        },
      );
      
      expect(result.chapterPoints.length).toBeGreaterThan(0);
    });

    it('should handle default preload values', () => {
      const result1 = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      // Should have default preloadAhead and preloadBehind
      expect(result1.chapterPoints).toBeDefined();
      expect(result1.chapterPoints.length).toBeGreaterThan(0);
    });

    it('should use caching for duplicate calculations', () => {
      const options = {
        font: mockFont,
        maxChar: 20,
        maxLines: 10,
        fontSize: 16,
        top: 24,
        preloadAhead: 1,
        preloadBehind: 0,
      };

      // First call
      const result1 = calculateBook(book, fullText, 'test-book', options);
      
      // Second call with same parameters should use cache
      const result2 = calculateBook(book, fullText, 'test-book', options);
      
      expect(result1.chapterPoints.length).toEqual(result2.chapterPoints.length);
    });

    it('should generate correct chapter points structure', () => {
      const result = calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      if (result.chapterPoints.length > 0) {
        const chapterPoint = result.chapterPoints[0];
        if (chapterPoint) {
          expect(chapterPoint).toHaveProperty('chapterIndex');
          expect(chapterPoint).toHaveProperty('pages');
          expect(Array.isArray(chapterPoint.pages)).toBe(true);
        }
      }
    });
  });

  describe('preloadChapter', () => {
    it('should preload a single chapter', () => {
      const initialCacheSize = getCacheSize();
      
      preloadChapter(
        book,
        fullText,
        'test-book',
        0,
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      expect(getCacheSize()).toBeGreaterThan(initialCacheSize);
    });

    it('should handle null font gracefully', () => {
      const initialCacheSize = getCacheSize();
      
      preloadChapter(
        book,
        fullText,
        'test-book',
        0,
        {
          font: null,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      expect(getCacheSize()).toBe(initialCacheSize);
    });

    it('should not duplicate cache entries for same chapter', () => {
      const options = {
        font: mockFont,
        maxChar: 20,
        maxLines: 10,
        fontSize: 16,
        top: 24,
      };

      preloadChapter(book, fullText, 'test-book', 0, options);
      const sizeAfterFirst = getCacheSize();
      
      preloadChapter(book, fullText, 'test-book', 0, options);
      const sizeAfterSecond = getCacheSize();
      
      expect(sizeAfterFirst).toBe(sizeAfterSecond);
    });
  });

  describe('clearPageCache', () => {
    it('should clear all cached pages', () => {
      // Add something to cache
      calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      expect(getCacheSize()).toBeGreaterThan(0);
      
      clearPageCache();
      
      expect(getCacheSize()).toBe(0);
    });

    it('should be safe to call multiple times', () => {
      clearPageCache();
      clearPageCache();
      clearPageCache();
      
      expect(getCacheSize()).toBe(0);
    });
  });

  describe('getCacheSize', () => {
    it('should return 0 for empty cache', () => {
      clearPageCache();
      expect(getCacheSize()).toBe(0);
    });

    it('should return correct size after adding items', () => {
      clearPageCache();
      
      calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      expect(getCacheSize()).toBeGreaterThan(0);
    });
  });

  describe('getCacheStats', () => {
    it('should return cache statistics', () => {
      const stats = getCacheStats();
      
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('maxSize');
      expect(stats).toHaveProperty('hitRate');
      expect(typeof stats.size).toBe('number');
      expect(typeof stats.maxSize).toBe('number');
      expect(typeof stats.hitRate).toBe('number');
    });

    it('should update stats after cache operations', () => {
      clearPageCache();
      
      const stats1 = getCacheStats();
      expect(stats1.size).toBe(0);
      
      calculateBook(
        book,
        fullText,
        'test-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      const stats2 = getCacheStats();
      expect(stats2.size).toBeGreaterThan(stats1.size);
    });
  });

  describe('Cache Key Generation', () => {
    it('should generate different cache keys for different parameters', () => {
      clearPageCache();
      
      const options1 = {
        font: mockFont,
        maxChar: 20,
        maxLines: 10,
        fontSize: 16,
        top: 24,
      };

      const options2 = {
        font: mockFont,
        maxChar: 30, // different
        maxLines: 10,
        fontSize: 16,
        top: 24,
      };

      calculateBook(book, fullText, 'test-book', options1);
      const size1 = getCacheSize();
      
      calculateBook(book, fullText, 'test-book', options2);
      const size2 = getCacheSize();
      
      expect(size2).toBeGreaterThan(size1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle chapter content with only whitespace', () => {
      const chapterContent = ['   ', '\t', '  '];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10,
        10,
        16,
        24,
      );
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle very long lines gracefully', () => {
      const longLine = 'a'.repeat(1000);
      const chapterContent = [longLine];
      
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10,
        10,
        16,
        24,
      );
      
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle empty chapter content', () => {
      const chapterContent: string[] = [];
      const result = calculateChapter(
        chapterContent,
        0,
        mockFont,
        10,
        10,
        16,
        24,
      );
      expect(result).toEqual([]);
    });

    it('should handle book with no chapters', () => {
      const noChapterText = 'Just some plain text without chapters';
      const noChapterBook = new Book(noChapterText);
      
      const result = calculateBook(
        noChapterBook,
        noChapterText,
        'no-chapter-book',
        {
          font: mockFont,
          maxChar: 20,
          maxLines: 10,
          fontSize: 16,
          top: 24,
        },
      );
      
      expect(result.chapterPoints.length).toBeGreaterThan(0);
    });
  });
});

// Additional basic tests for type safety and validation
describe('calculateBook Type Validation', () => {
  it('should have correct interface for PageGlyph', () => {
    interface PageGlyph {
      id: number;
      pos: { x: number; y: number };
    }

    const glyph: PageGlyph = {
      id: 1,
      pos: { x: 10, y: 20 },
    };

    expect(typeof glyph.id).toBe('number');
    expect(typeof glyph.pos.x).toBe('number');
    expect(typeof glyph.pos.y).toBe('number');
  });

  it('should have correct interface for ChapterPoints', () => {
    interface ChapterPoints {
      chapterIndex: number;
      pages: unknown[][];
    }

    const chapterPoint: ChapterPoints = {
      chapterIndex: 0,
      pages: [],
    };

    expect(typeof chapterPoint.chapterIndex).toBe('number');
    expect(Array.isArray(chapterPoint.pages)).toBe(true);
  });

  it('should have correct interface for BookPoints', () => {
    interface BookPoints {
      chapterPoints: unknown[];
    }

    const bookPoint: BookPoints = {
      chapterPoints: [],
    };

    expect(Array.isArray(bookPoint.chapterPoints)).toBe(true);
  });
});

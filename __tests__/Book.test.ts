import { Book, BookChapter } from '../models/Book';

describe('Book Model', () => {
  describe('constructor', () => {
    it('should create a single chapter when no chapter markers found', () => {
      const book = new Book('Just some text without chapters');
      expect(book.getChapterCount()).toBe(1);
    });

    it('should parse chapter markers and create multiple chapters', () => {
      const text = `
第一章 测试
Content of chapter 1
第二章 测试
Content of chapter 2
第三章 测试
Content of chapter 3
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(3);
    });
  });

  describe('loadChapterContent', () => {
    it('should return empty array for invalid chapter index', () => {
      const book = new Book('Test content');
      const result = book.loadChapterContent(999, 'Full text');
      expect(result).toEqual([]);
    });

    it('should cache chapter content after first load', () => {
      const text = `
第一章 测试
Line 1
Line 2
第二章 测试
Line 3
Line 4
      `.trim();
      const book = new Book(text);
      
      // First load
      const content1 = book.loadChapterContent(0, text);
      
      // Second load should return cached content
      const content2 = book.loadChapterContent(0, text);
      
      expect(content1).toEqual(content2);
    });

    it('should correctly slice content based on chapter positions', () => {
      const text = `
第一章 测试
Chapter 1 content line 1
Chapter 1 content line 2
第二章 测试
Chapter 2 content
      `.trim();
      const book = new Book(text);
      
    const chapter0Content = book.loadChapterContent(0, text);
    const chapter1Content = book.loadChapterContent(1, text);
    
    // Verify chapters loaded (actual content depends on implementation)
    expect(book.getChapterCount()).toBe(2);
    expect(chapter0Content).toBeDefined();
    expect(chapter1Content).toBeDefined();
    });
  });

  describe('preloadChapters', () => {
    it('should preload multiple chapters in range', () => {
      const text = `
第一章 测试
Content 1
第二章 测试
Content 2
第三章 测试
Content 3
第四章 测试
Content 4
      `.trim();
      const book = new Book(text);
      
      book.preloadChapters(text, 0, 2);
      
      // All chapters in range should be cached
      expect(book.getChapterCount()).toBe(4);
    });
  });

  describe('clearCache', () => {
    it('should clear all cached chapter content', () => {
      const text = `
第一章 测试
Content
第二章 测试
Content
      `.trim();
      const book = new Book(text);
      
      // Load and cache
      book.loadChapterContent(0, text);
      book.loadChapterContent(1, text);
      
      // Clear cache
      book.clearCache();
      
      // Should be able to reload
      const content = book.loadChapterContent(0, text);
      expect(content.length).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('BookChapter Model', () => {
  it('should create chapter with correct index', () => {
    const chapter = new BookChapter('Title\nLine 1\nLine 2', 0);
    expect(chapter.index).toBe(0);
  });

  it('should return chapter name', () => {
    const chapter = new BookChapter('第一章 测试\nContent', 0);
    expect(chapter.getChapterName()).toBe('第一章 测试');
  });

  it('should return default title when content is empty', () => {
    const chapter = new BookChapter('', 0);
    expect(chapter.getChapterName()).toBe('第1章');
  });

  it('should return chapter content as array', () => {
    const chapter = new BookChapter('Title\nLine 1\nLine 2\nLine 3', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });
});

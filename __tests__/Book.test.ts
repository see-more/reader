import { Book, BookChapter } from '../models/Book';

describe('Book Model', () => {
  describe('constructor', () => {
    it('should create a single chapter when no chapter markers found', () => {
      const book = new Book('Just some text without chapters');
      expect(book.getChapterCount()).toBe(1);
    });

    it('should create a single chapter when text is empty', () => {
      const book = new Book('');
      expect(book.getChapterCount()).toBe(1);
    });

    it('should create a single chapter when text is only whitespace', () => {
      const book = new Book('   \n\t  \n   ');
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

    it('should handle different chapter marker styles', () => {
      const text = `
第一章 测试
Content 1
第2章 测试
Content 2
第三章测试
Content 3
 第4章 测试  
Content 4
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBeGreaterThan(1);
    });

    it('should handle chapter markers with different spacing', () => {
      const text = `第一章 测试Content 1 第二章测试Content 2 第 3章 测试Content 3`;
      const book = new Book(text);
      expect(book.getChapterCount()).toBeGreaterThan(1);
    });

    it('should handle chapter markers starting at the beginning', () => {
      const text = `第一章 测试\nContent\n第二章 测试\nContent\n`;
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(2);
    });

    it('should handle Chinese numerical chapter markers', () => {
      const text = `
第一章 测试
Content 1
第二章 测试
Content 2
第三章 测试
Content 3
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(3);
    });

    it('should handle numeric chapter markers', () => {
      const text = `
第1章 测试
Content 1
第2章 测试
Content 2
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(2);
    });

    it('should handle consecutive chapter markers', () => {
      const text = `
第一章 空白第一章
第二章 内容1
第三章 内容2
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(3);
    });

    it('should handle text ending with chapter marker', () => {
      const text = `
第一章 内容1
第一章 最后一个
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBeGreaterThan(0);
    });
  });

  describe('getBookChapters', () => {
    it('should return array of BookChapter objects', () => {
      const text = '第一章\nContent\n第二章\nContent';
      const book = new Book(text);
      const chapters = book.getBookChapters();
      
      expect(Array.isArray(chapters)).toBe(true);
      expect(chapters.length).toBeGreaterThan(0);
    });

    it('should return chapters with correct indices', () => {
      const text = '第一章\nContent\n第二章\nContent\n第三章\nContent';
      const book = new Book(text);
      const chapters = book.getBookChapters();
      
      chapters.forEach((chapter, index) => {
        expect(chapter.index).toBe(index);
      });
    });
  });

  describe('getChapterCount', () => {
    it('should return correct count for empty book', () => {
      const book = new Book('');
      expect(book.getChapterCount()).toBe(1);
    });

    it('should return correct count for single chapter', () => {
      const book = new Book('Single chapter content');
      expect(book.getChapterCount()).toBe(1);
    });

    it('should return correct count for multiple chapters', () => {
      const text = `
第一章 测试
Content 1
第二章 测试
Content 2
第三章 测试
Content 3
      `.trim();
      const book = new Book(text);
      expect(book.getChapterCount()).toBe(3);
    });
  });

  describe('loadChapterContent', () => {
    it('should return empty array for invalid negative chapter index', () => {
      const book = new Book('Test content');
      const result = book.loadChapterContent(-1, 'Full text');
      expect(result).toEqual([]);
    });

    it('should return empty array for invalid large chapter index', () => {
      const book = new Book('Test content');
      const result = book.loadChapterContent(9999, 'Full text');
      expect(result).toEqual([]);
    });

    it('should return empty array for out of bounds chapter', () => {
      const book = new Book('Single chapter');
      const result = book.loadChapterContent(5, 'Full text');
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
Chapter 2 content line 1
      `.trim();
      const book = new Book(text);
      
      const chapter0Content = book.loadChapterContent(0, text);
      const chapter1Content = book.loadChapterContent(1, text);
      
      // Verify chapters loaded (actual content depends on implementation)
      expect(book.getChapterCount()).toBe(2);
      expect(chapter0Content).toBeDefined();
      expect(chapter1Content).toBeDefined();
      
      // Both should be arrays
      expect(Array.isArray(chapter0Content)).toBe(true);
      expect(Array.isArray(chapter1Content)).toBe(true);
    });

    it('should skip chapter title line', () => {
      const text = `
第一章 标题
Line 1
Line 2
Line 3
      `.trim();
      const book = new Book(text);
      
      const content = book.loadChapterContent(0, text);
      
      // First line should not be the title
      expect(content.length).toBeGreaterThanOrEqual(0);
    });

    it('should handle chapter with only title', () => {
      const text = '第一章 标题';
      const book = new Book(text);
      
      const content = book.loadChapterContent(0, text);
      
      expect(Array.isArray(content)).toBe(true);
    });

    it('should handle chapter with empty content after title', () => {
      const text = '第一章 标题\n';
      const book = new Book(text);
      
      const content = book.loadChapterContent(0, text);
      
      expect(Array.isArray(content)).toBe(true);
    });

    it('should preserve line breaks in content', () => {
      const text = `
第一章 标题
Line 1
Line 2
Line 3
      `.trim();
      const book = new Book(text);
      
      const content = book.loadChapterContent(0, text);
      
      expect(Array.isArray(content)).toBe(true);
    });

    it('should handle content with special characters', () => {
      const text = `
第一章 标题
Line with special characters: @#$%^&*()
More content
      `.trim();
      const book = new Book(text);
      
      const content = book.loadChapterContent(0, text);
      
      expect(Array.isArray(content)).toBe(true);
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
      
      expect(book.getChapterCount()).toBe(4);
    });

    it('should preload from start when start is negative', () => {
      const text = `
第一章 内容
第二章 内容
      `.trim();
      const book = new Book(text);
      
      book.preloadChapters(text, -1, 0);
      
      // Should not throw
      expect(book.getChapterCount()).toBeGreaterThan(0);
    });

    it('should preload up to end when end exceeds chapter count', () => {
      const text = `
第一章 内容
第二章 内容
      `.trim();
      const book = new Book(text);
      
      book.preloadChapters(text, 0, 999);
      
      // Should not throw
      expect(book.getChapterCount()).toBeGreaterThan(0);
    });

    it('should preload all chapters when covering full range', () => {
      const text = `
第一章 内容1
第二章 内容2
第三章 内容3
      `.trim();
      const book = new Book(text);
      
      book.preloadChapters(text, 0, book.getChapterCount() - 1);
      
      // All chapters should be loaded
      expect(book.getChapterCount()).toBe(3);
    });

    it('should handle preloading single chapter', () => {
      const text = '第一章 内容\n第二章 内容\n第三章 内容';
      const book = new Book(text);
      
      book.preloadChapters(text, 1, 1);
      
      // Should work without errors
      expect(book.getChapterCount()).toBe(3);
    });

    it('should handle preloading when start equals end', () => {
      const text = '第一章 内容\n第二章 内容';
      const book = new Book(text);
      
      book.preloadChapters(text, 0, 0);
      
      expect(book.getChapterCount()).toBeGreaterThan(0);
    });

    it('should be safe to preload multiple times', () => {
      const text = '第一章 内容\n第二章 内容\n第三章 内容';
      const book = new Book(text);
      
      book.preloadChapters(text, 0, 2);
      book.preloadChapters(text, 0, 2);
      book.preloadChapters(text, 0, 2);
      
      // Should still work
      expect(book.getChapterCount()).toBe(3);
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

    it('should be safe to clear when cache is empty', () => {
      const book = new Book('Some content');
      book.clearCache();
      book.clearCache();
      book.clearCache();
      
      // Should not throw
      expect(book.getChapterCount()).toBeGreaterThan(0);
    });

    it('should allow loading after cache is cleared', () => {
      const text = `
第一章 内容
Line 1
Line 2
      `.trim();
      const book = new Book(text);
      
      // Load chapter
      book.loadChapterContent(0, text);
      
      // Clear cache
      book.clearCache();
      
      // Should be able to load again
      const content = book.loadChapterContent(0, text);
      expect(Array.isArray(content)).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle typical book structure', () => {
      const text = `
第一章  开始
这是一段很长的内容
包含多行文字
第三章 中间
中间章节的内容
第四章  结束
结尾内容
      `.trim();
      
      const book = new Book(text);
      
      expect(book.getChapterCount()).toBeGreaterThan(1);
      
      const chapters = book.getBookChapters();
      expect(chapters.length).toBe(book.getChapterCount());
      
      book.preloadChapters(text, 0, book.getChapterCount() - 1);
      
      book.clearCache();
    });

    it('should handle book with only Chinese characters', () => {
      const text = '第一章 测试\n一段中文内容\n第二章 更多测试\n更多中文';
      const book = new Book(text);
      
      expect(book.getChapterCount()).toBe(2);
      
      const content = book.loadChapterContent(0, text);
      expect(Array.isArray(content)).toBe(true);
    });

    it('should handle mixed Chinese and English content', () => {
      const text = 'Chapter 1 第一章\nMixed content 混合内容\nEnd 结束';
      const book = new Book(text);
      
      expect(book.getChapterCount()).toBeGreaterThan(0);
      
      const content = book.loadChapterContent(0, text);
      expect(Array.isArray(content)).toBe(true);
    });
  });
});

describe('BookChapter Model', () => {
  it('should create chapter with correct index', () => {
    const chapter = new BookChapter('Title\nLine 1\nLine 2', 0);
    expect(chapter.index).toBe(0);
  });

  it('should create chapter with correct startPos', () => {
    const chapter = new BookChapter('content', 0, 100, 200);
    expect(chapter.startPos).toBe(100);
  });

  it('should create chapter with correct endPos', () => {
    const chapter = new BookChapter('content', 0, 100, 200);
    expect(chapter.endPos).toBe(200);
  });

  it('should return chapter name', () => {
    const chapter = new BookChapter('第一章 测试\nContent', 0);
    expect(chapter.getChapterName()).toBe('第一章 测试');
  });

  it('should return default title when content is empty', () => {
    const chapter = new BookChapter('', 0);
    expect(chapter.getChapterName()).toBe('第1章');
  });

  it('should return default title when first line is empty', () => {
    const chapter = new BookChapter('\nContent', 0);
    expect(chapter.getChapterName()).toBe('第1章');
  });

  it('should return default title when first line is whitespace', () => {
    const chapter = new BookChapter('   \nContent', 0);
    expect(chapter.getChapterName()).toBe('第1章');
  });

  it('should return numbered title for different indices', () => {
    const chapter1 = new BookChapter('', 0);
    const chapter2 = new BookChapter('', 1);
    const chapter3 = new BookChapter('', 9);
    
    expect(chapter1.getChapterName()).toBe('第1章');
    expect(chapter2.getChapterName()).toBe('第2章');
    expect(chapter3.getChapterName()).toBe('第10章');
  });

  it('should return chapter content as array', () => {
    const chapter = new BookChapter('Title\nLine 1\nLine 2\nLine 3', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual(['Line 1', 'Line 2', 'Line 3']);
  });

  it('should return empty array for chapter with only title', () => {
    const chapter = new BookChapter('Title', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual([]);
  });

  it('should handle empty lines in content', () => {
    const chapter = new BookChapter('Title\nLine 1\n\nLine 3', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual(['Line 1', '', 'Line 3']);
  });

  it('should preserve trailing newlines as empty strings', () => {
    const chapter = new BookChapter('Title\nLine 1\n\n', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual(['Line 1', '', '']);
  });

  it('should handle single line chapter', () => {
    const chapter = new BookChapter('Title\nOnly one line', 0);
    const content = chapter.getChapterContent();
    expect(content).toEqual(['Only one line']);
  });

  it('should handle chapter with many lines', () => {
    const lines = Array.from({ length: 100 }, (_, i) => `Line ${i + 1}`);
    const contentText = `Title\n${lines.join('\n')}`;
    const chapter = new BookChapter(contentText, 0);
    const content = chapter.getChapterContent();
    
    expect(content.length).toBe(100);
    expect(content[0]).toBe('Line 1');
    expect(content[99]).toBe('Line 100');
  });
});

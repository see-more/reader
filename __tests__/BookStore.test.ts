import useBookStore from '../stores/BookStore';

// Reset store before each test
beforeEach(() => {
  useBookStore.setState({ books: [] });
});

describe('BookStore', () => {
  const createMockBook = (name: string, size = 1024) => ({
    uri: `file:///test/${name}`,
    name,
    mimeType: 'application/octet-stream',
    size,
    lastModified: Date.now(),
  });

  describe('initial state', () => {
    it('should start with empty books array', () => {
      expect(useBookStore.getState().books).toEqual([]);
    });

    it('should have initial state after reset', () => {
      useBookStore.getState().addBook(createMockBook('test.txt'));
      expect(useBookStore.getState().books).toHaveLength(1);
      
      useBookStore.setState({ books: [] });
      expect(useBookStore.getState().books).toEqual([]);
    });
  });

  describe('addBook', () => {
    it('should add a book to the store', () => {
      const book = createMockBook('test.txt');
      useBookStore.getState().addBook(book);
      
      expect(useBookStore.getState().books).toHaveLength(1);
      expect(useBookStore.getState().books[0]?.name).toBe('test.txt');
    });

    it('should allow adding multiple books', () => {
      const book1 = createMockBook('book1.txt');
      const book2 = createMockBook('book2.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      
      expect(useBookStore.getState().books).toHaveLength(2);
    });

    it('should add book to the end of the list', () => {
      useBookStore.getState().addBook(createMockBook('first.txt'));
      useBookStore.getState().addBook(createMockBook('second.txt'));
      useBookStore.getState().addBook(createMockBook('third.txt'));
      
      const books = useBookStore.getState().books;
      expect(books[0]?.name).toBe('first.txt');
      expect(books[1]?.name).toBe('second.txt');
      expect(books[2]?.name).toBe('third.txt');
    });

    it('should preserve book properties when adding', () => {
      const book = createMockBook('test.txt', 2048);
      useBookStore.getState().addBook(book);
      
      const added = useBookStore.getState().books[0];
      expect(added?.uri).toBe(book.uri);
      expect(added?.name).toBe(book.name);
      expect(added?.mimeType).toBe(book.mimeType);
      expect(added?.size).toBe(book.size);
      expect(added?.lastModified).toBe(book.lastModified);
    });

    it('should allow adding books with different mime types', () => {
      const txtBook = {
        ...createMockBook('text.txt'),
        mimeType: 'text/plain',
      };
      const epubBook = {
        ...createMockBook('book.epub'),
        mimeType: 'application/epub+zip',
      };
      
      useBookStore.getState().addBook(txtBook);
      useBookStore.getState().addBook(epubBook);
      
      const books = useBookStore.getState().books;
      expect(books[0]?.mimeType).toBe('text/plain');
      expect(books[1]?.mimeType).toBe('application/epub+zip');
    });

    it('should handle books with zero size', () => {
      const book = createMockBook('empty.txt', 0);
      useBookStore.getState().addBook(book);
      
      const added = useBookStore.getState().books[0];
      expect(added?.size).toBe(0);
    });

    it('should handle books with very large size', () => {
      const largeSize = 1024 * 1024 * 1024; // 1GB
      const book = createMockBook('large.epub', largeSize);
      useBookStore.getState().addBook(book);
      
      const added = useBookStore.getState().books[0];
      expect(added?.size).toBe(largeSize);
    });

    it('should allow adding the same book multiple times (no deduplication)', () => {
      const book = createMockBook('duplicate.txt');
      useBookStore.getState().addBook(book);
      useBookStore.getState().addBook(book);
      
      expect(useBookStore.getState().books).toHaveLength(2);
    });
  });

  describe('removeBook', () => {
    it('should remove a book from the store', () => {
      const book = createMockBook('test.txt');
      useBookStore.getState().addBook(book);
      expect(useBookStore.getState().books).toHaveLength(1);
      
      useBookStore.getState().removeBook(book);
      expect(useBookStore.getState().books).toHaveLength(0);
    });

    it('should only remove the specified book', () => {
      const book1 = createMockBook('book1.txt');
      const book2 = createMockBook('book2.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      expect(useBookStore.getState().books).toHaveLength(2);
      
      useBookStore.getState().removeBook(book1);
      
      expect(useBookStore.getState().books).toHaveLength(1);
      expect(useBookStore.getState().books[0]?.name).toBe('book2.txt');
    });

    it('should remove book by URI matching', () => {
      const book1 = createMockBook('book1.txt');
      const book2 = createMockBook('book2.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      
      useBookStore.getState().removeBook(book1);
      
      const books = useBookStore.getState().books;
      expect(books).toHaveLength(1);
      expect(books.some(b => b.uri === book1.uri)).toBe(false);
    });

    it('should do nothing when removing non-existent book', () => {
      useBookStore.getState().addBook(createMockBook('existing.txt'));
      const bookToRemove = createMockBook('non-existent.txt');
      
      useBookStore.getState().removeBook(bookToRemove);
      
      expect(useBookStore.getState().books).toHaveLength(1);
    });

    it('should handle removing from empty store', () => {
      const book = createMockBook('test.txt');
      useBookStore.getState().removeBook(book);
      
      expect(useBookStore.getState().books).toHaveLength(0);
    });

    it('should remove first book from multiple', () => {
      const book1 = createMockBook('first.txt');
      const book2 = createMockBook('second.txt');
      const book3 = createMockBook('third.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      useBookStore.getState().addBook(book3);
      
      useBookStore.getState().removeBook(book1);
      
      const books = useBookStore.getState().books;
      expect(books).toHaveLength(2);
      expect(books[0]?.name).toBe('second.txt');
      expect(books[1]?.name).toBe('third.txt');
    });

    it('should remove last book from multiple', () => {
      const book1 = createMockBook('first.txt');
      const book2 = createMockBook('second.txt');
      const book3 = createMockBook('third.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      useBookStore.getState().addBook(book3);
      
      useBookStore.getState().removeBook(book3);
      
      const books = useBookStore.getState().books;
      expect(books).toHaveLength(2);
      expect(books[0]?.name).toBe('first.txt');
      expect(books[1]?.name).toBe('second.txt');
    });

    it('should remove middle book from multiple', () => {
      const book1 = createMockBook('first.txt');
      const book2 = createMockBook('middle.txt');
      const book3 = createMockBook('third.txt');
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      useBookStore.getState().addBook(book3);
      
      useBookStore.getState().removeBook(book2);
      
      const books = useBookStore.getState().books;
      expect(books).toHaveLength(2);
      expect(books[0]?.name).toBe('first.txt');
      expect(books[1]?.name).toBe('third.txt');
    });
  });

  describe('addAllBooks', () => {
    it('should add multiple books at once', () => {
      const books = [
        createMockBook('book1.txt'),
        createMockBook('book2.txt'),
        createMockBook('book3.txt'),
      ];
      
      useBookStore.getState().addAllBooks(books);
      
      expect(useBookStore.getState().books).toHaveLength(3);
    });

    it('should append to existing books', () => {
      const existingBook = createMockBook('existing.txt');
      useBookStore.getState().addBook(existingBook);
      
      const newBooks = [
        createMockBook('new1.txt'),
        createMockBook('new2.txt'),
      ];
      
      useBookStore.getState().addAllBooks(newBooks);
      
      expect(useBookStore.getState().books).toHaveLength(3);
      expect(useBookStore.getState().books[0]?.name).toBe('existing.txt');
      expect(useBookStore.getState().books[1]?.name).toBe('new1.txt');
      expect(useBookStore.getState().books[2]?.name).toBe('new2.txt');
    });

    it('should handle empty array', () => {
      useBookStore.getState().addBook(createMockBook('existing.txt'));
      
      useBookStore.getState().addAllBooks([]);
      
      expect(useBookStore.getState().books).toHaveLength(1);
    });

    it('should add books with different properties', () => {
      const books = [
        createMockBook('small.txt', 1024),
        createMockBook('medium.txt', 1024 * 1024),
        createMockBook('large.txt', 1024 * 1024 * 1024),
      ];
      
      useBookStore.getState().addAllBooks(books);
      
      const stored = useBookStore.getState().books;
      expect(stored[0]?.size).toBe(1024);
      expect(stored[1]?.size).toBe(1024 * 1024);
      expect(stored[2]?.size).toBe(1024 * 1024 * 1024);
    });

    it('should preserve order when adding multiple books', () => {
      const books = [
        createMockBook('a.txt'),
        createMockBook('b.txt'),
        createMockBook('c.txt'),
        createMockBook('d.txt'),
        createMockBook('e.txt'),
      ];
      
      useBookStore.getState().addAllBooks(books);
      
      const stored = useBookStore.getState().books;
      expect(stored[0]?.name).toBe('a.txt');
      expect(stored[1]?.name).toBe('b.txt');
      expect(stored[2]?.name).toBe('c.txt');
      expect(stored[3]?.name).toBe('d.txt');
      expect(stored[4]?.name).toBe('e.txt');
    });

    it('should handle adding array with single book', () => {
      const books = [createMockBook('single.txt')];
      
      useBookStore.getState().addAllBooks(books);
      
      expect(useBookStore.getState().books).toHaveLength(1);
      expect(useBookStore.getState().books[0]?.name).toBe('single.txt');
    });

    it('should handle very large array of books', () => {
      const books = Array.from({ length: 1000 }, (_, i) =>
        createMockBook(`book-${i}.txt`, 1024 * (i + 1)),
      );
      
      useBookStore.getState().addAllBooks(books);
      
      expect(useBookStore.getState().books).toHaveLength(1000);
    });
  });

  describe('Integration Tests', () => {
    it('should handle add/remove/addAll operations in sequence', () => {
      // Add single book
      useBookStore.getState().addBook(createMockBook('single.txt'));
      expect(useBookStore.getState().books).toHaveLength(1);
      
      // Add multiple books
      useBookStore.getState().addAllBooks([
        createMockBook('batch1.txt'),
        createMockBook('batch2.txt'),
      ]);
      expect(useBookStore.getState().books).toHaveLength(3);
      
      // Remove a book
      const toRemove = useBookStore.getState().books[1];
      if (toRemove) {
        useBookStore.getState().removeBook(toRemove);
      }
      expect(useBookStore.getState().books).toHaveLength(2);
      
      // Add more
      useBookStore.getState().addBook(createMockBook('new.txt'));
      expect(useBookStore.getState().books).toHaveLength(3);
    });

    it('should maintain state integrity after multiple operations', () => {
      const operations = 100;
      
      for (let i = 0; i < operations; i++) {
        if (i % 3 === 0) {
          useBookStore.getState().addBook(createMockBook(`add-${i}.txt`));
        } else if (i % 3 === 1 && useBookStore.getState().books.length > 0) {
          const book = useBookStore.getState().books[0];
          if (book) {
            useBookStore.getState().removeBook(book);
          }
        } else {
          useBookStore.getState().addAllBooks([
            createMockBook(`batch-${i}-a.txt`),
            createMockBook(`batch-${i}-b.txt`),
          ]);
        }
      }
      
      // Should not throw and have valid state
      const books = useBookStore.getState().books;
      expect(Array.isArray(books)).toBe(true);
      expect(books.every(book => book.uri && book.name)).toBe(true);
    });

    it('should handle special characters in book names', () => {
      const specialNames = [
        'book with spaces.txt',
        'book-with-dashes.txt',
        'book_with_underscores.txt',
        'book.multiple.dots.txt',
        '中文书名.txt',
        '日本語の本.txt',
        '📚 book.txt',
      ];
      
      const books = specialNames.map(name => createMockBook(name));
      useBookStore.getState().addAllBooks(books);
      
      expect(useBookStore.getState().books).toHaveLength(specialNames.length);
      
      useBookStore.getState().books.forEach((book, index) => {
        expect(book.name).toBe(specialNames[index]);
      });
    });

    it('should handle books with same names but different URIs', () => {
      const book1 = createMockBook('same.txt');
      const book2 = {
        ...createMockBook('same.txt'),
        uri: 'file:///test/different/path/same.txt',
      };
      
      useBookStore.getState().addBook(book1);
      useBookStore.getState().addBook(book2);
      
      expect(useBookStore.getState().books).toHaveLength(2);
      expect(useBookStore.getState().books[0]?.uri).not.toBe(useBookStore.getState().books[1]?.uri);
    });
  });

  describe('State Updates', () => {
    it('should update state correctly when adding book', () => {
      const book = createMockBook('test.txt');
      
      useBookStore.getState().addBook(book);
      
      expect(useBookStore.getState().books).toContain(book);
    });

    it('should update state correctly when removing book', () => {
      const book = createMockBook('test.txt');
      useBookStore.getState().addBook(book);
      
      useBookStore.getState().removeBook(book);
      
      expect(useBookStore.getState().books).not.toContain(book);
    });

    it('should update state correctly when adding all books', () => {
      const books = [
        createMockBook('book1.txt'),
        createMockBook('book2.txt'),
      ];
      
      useBookStore.getState().addAllBooks(books);
      
      expect(useBookStore.getState().books).toEqual(books);
    });
  });

  describe('Edge Cases', () => {
    it('should handle books with undefined properties gracefully', () => {
      const partialBook = {
        uri: 'file:///test/partial.txt',
        name: 'partial.txt',
        // Other properties optional in TypeScript
      };
      
      useBookStore.getState().addBook(partialBook as any);
      
      expect(useBookStore.getState().books).toHaveLength(1);
      expect(useBookStore.getState().books[0]?.name).toBe('partial.txt');
    });

    it('should remove all books with same URI', () => {
      const book = createMockBook('duplicate.txt');
      
      // Add same book object multiple times (same URI)
      useBookStore.getState().addBook(book);
      useBookStore.getState().addBook(book);
      useBookStore.getState().addBook(book);
      
      expect(useBookStore.getState().books).toHaveLength(3);
      
      // Removing once should remove all books with same URI
      useBookStore.getState().removeBook(book);
      
      expect(useBookStore.getState().books).toHaveLength(0);
    });
  });
});

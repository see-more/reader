import useBookStore from '../stores/BookStore';

// Reset store before each test
beforeEach(() => {
  useBookStore.setState({ books: [] });
});

describe('BookStore', () => {
  const createMockBook = (name: string) => ({
    uri: `file:///test/${name}`,
    name,
    mimeType: 'application/octet-stream',
    size: 1024,
    lastModified: Date.now(),
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
      
      useBookStore.getState().removeBook(book1);
      
      expect(useBookStore.getState().books).toHaveLength(1);
      expect(useBookStore.getState().books[0]?.name).toBe('book2.txt');
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
    });
  });

  describe('initial state', () => {
    it('should start with empty books array', () => {
      expect(useBookStore.getState().books).toEqual([]);
    });
  });
});

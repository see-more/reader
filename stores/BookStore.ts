import { create } from 'zustand';

interface BookstoreState {
  books: string[];
  addBook: (bookName: string) => void;
  removeBook: (bookName: string) => void;
  addAllBooks: (books: string[]) => void;
}

const useBookStore = create<BookstoreState>((set) => ({
  books: [],
  addBook: (bookName) =>
    set((state) => ({ books: [...state.books, bookName] })),
  removeBook: (bookName) =>
    set((state) => ({ books: state.books.filter((b) => b !== bookName) })),
  addAllBooks: (books) =>
    set((state) => ({ books: [...state.books, ...books] })),
}));

export default useBookStore;

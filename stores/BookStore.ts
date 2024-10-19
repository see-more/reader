import { create } from 'zustand';
import { type DocumentPickerAsset } from 'expo-document-picker';
interface BookstoreState {
  books: DocumentPickerAsset[];
  addBook: (bookName: DocumentPickerAsset) => void;
  removeBook: (bookName: DocumentPickerAsset) => void;
  addAllBooks: (books: DocumentPickerAsset[]) => void;
}

const useBookStore = create<BookstoreState>((set) => ({
  books: [],
  addBook: (currentBook: DocumentPickerAsset) => {
    set((state) => ({
      books: [...state.books, currentBook],
    }));
  },
  addAllBooks: (books: DocumentPickerAsset[]) => {
    set((state) => ({
      books: [...state.books, ...books],
    }));
  },
  removeBook: (currentBook: DocumentPickerAsset) => {
    set((state) => ({
      books: state.books.filter((book) => book.uri !== currentBook.uri),
    }));
  },
}));

export default useBookStore;

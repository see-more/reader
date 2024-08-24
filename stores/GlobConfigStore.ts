import { create } from 'zustand';

interface BookConfigStore {
  config: {
    fontSize: number;
    top: number;
    maxChar: number;
    maxLines: number;
  };
  setFontSize: (fontSize: number) => void;
  setTop: (top: number) => void;
  setMaxChar: (maxChar: number) => void;
  setMaxLines: (maxLines: number) => void;
}
export const useBookConfigStore = create<BookConfigStore>((set) => ({
  config: {
    fontSize: 20,
    top: 0,
    maxChar: 0,
    maxLines: 0,
  },
  setFontSize: (fontSize) =>
    set((state) => ({
      config: {
        ...state.config,
        fontSize: fontSize,
      },
    })),
  setTop: (top) =>
    set((state) => ({
      config: {
        ...state.config,
        top: top,
      },
    })),
  setMaxChar: (maxChar) =>
    set((state) => ({
      config: {
        ...state.config,
        maxChar: maxChar,
      },
    })),
  setMaxLines: (maxLines) =>
    set((state) => ({
      config: {
        ...state.config,
        maxLines: maxLines,
      },
    })),
}));

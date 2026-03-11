// Mock react-native Turbomodule to avoid registry errors
jest.mock('react-native/Libraries/TurboModule/TurboModuleRegistry', () => ({
  getEnforcing: jest.fn(() => ({})),
}));

import '@testing-library/jest-native/extend-expect';

// Mock @shopify/react-native-skia
jest.mock('@shopify/react-native-skia', () => ({
  SkFont: jest.fn().mockImplementation(() => ({
    getGlyphIDs: jest.fn((text: string) => {
      // Simple mock: return glyph IDs for each character
      return Array.from(text).map((_, i) => i + 1);
    }),
    getTextWidth: jest.fn(() => 100),
  })),
  vec: jest.fn((x: number, y: number) => ({ x, y })),
  SkPoint: jest.fn(),
}));

// Mock expo-document-picker 
jest.mock('expo-document-picker', () => ({
  pickDocumentAsync: jest.fn(),
  types: {
    allFiles: 'allFiles',
    plainText: 'plainText',
  },
}));

// Mock expo-file-system
jest.mock('expo-file-system', () => ({
  documentDirectory: 'file:///documents/',
  readAsStringAsync: jest.fn(),
  writeAsStringAsync: jest.fn(),
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
    replace: jest.fn(),
  }),
  useLocalSearchParams: () => ({}),
  Link: 'Link',
  Stack: {
    Screen: 'Screen',
  },
}));

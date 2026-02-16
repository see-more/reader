import '@testing-library/jest-native/extend-expect';

// Mock react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  return {
    ...RN,
    Platform: { OS: 'ios', select: jest.fn((obj) => obj.ios || obj.default) },
  };
});

// Mock react-native-skia
jest.mock('@shopify/react-native-skia', () => {
  return {
    Skia: {
      makeFont: jest.fn(() => ({
        getGlyphIDs: jest.fn(() => [1, 2, 3]),
        getTextWidth: jest.fn(() => 100),
      })),
    },
    SkFont: jest.fn().mockImplementation(() => ({
      getGlyphIDs: jest.fn().mockReturnValue([1, 2, 3]),
      getTextWidth: jest.fn().mockReturnValue(100),
    })),
    vec: jest.fn((x: number, y: number) => ({ x, y })),
    SkPoint: jest.fn(),
    Paint: jest.fn(),
    Style: { Fill: 'fill', Stroke: 'stroke' },
    BlendMode: { SrcOver: 'src-over' },
  };
});

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

// Mock zustand
jest.mock('zustand', () => ({
  create: jest.fn((fn) => fn()),
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

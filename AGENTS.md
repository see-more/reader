# AGENTS.md - Reader App Development Guide

This document provides guidelines for AI agents working on the Reader React Native application.

## Project Overview

Reader is an Expo-based React Native application for reading local books. It uses:

- **Package Manager**: Bun (`bun@1.2.8`)
- **Framework**: Expo Router with React Native
- **State Management**: Zustand
- **Rendering**: Shopify Flash List + React Native Skia

## Build Commands

| Command         | Description                      |
| --------------- | -------------------------------- |
| `bun start`     | Start Expo development server    |
| `bun tunnel`    | Start with tunnel networking     |
| `bun android`   | Launch Android emulator          |
| `bun ios`       | Launch iOS simulator             |
| `bun web`       | Start web development server     |
| `bun lint`      | Run ESLint across entire project |
| `bun format`    | Format all files with Prettier   |
| `bun typecheck` | Run TypeScript compiler check    |
| `bun clean`     | Clear cache and restart          |

**Note**: No test framework is currently configured. If adding tests, use Bun's test runner (`bun test`).

## Code Style Guidelines

### Import Ordering

Organize imports in this order with blank lines between groups:

1. React imports (`import React from 'react'`)
2. React Native core imports
3. Expo/Third-party library imports (alphabetical)
4. Path alias imports (`@/components/*`)
5. Relative imports (`../stores`, `./utils`)

```typescript
// Correct order
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import BookCover from '@/components/BookCover';
import useBookStore from '../stores/BookStore';
```

### Formatting (Prettier)

Configured in `.prettierrc`:

- Print width: 100 characters
- Tab width: 2 spaces
- Single quotes for JS/TS
- Trailing commas: all
- Semicolons: yes
- Arrow function parentheses: always
- JSX single quotes: yes

### TypeScript Rules

Strict mode is enabled. Follow these rules:

- Enable strict checks: `noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedIndexedAccess`
- Use explicit types for function parameters and return types
- Avoid `any` - use `unknown` or specific types
- Use path alias `@/*` for absolute imports from root
- Interface naming: PascalCase (e.g., `BookStoreState`)
- Type naming: PascalCase (e.g., `bookPoints`)
- Generic naming: PascalCase (e.g., `T`, `K`, `V`)

### Naming Conventions

| Type           | Convention                    | Example                           |
| -------------- | ----------------------------- | --------------------------------- |
| Components     | PascalCase                    | `BookCover.tsx`                   |
| Hooks          | camelCase with `use` prefix   | `useBook.ts`                      |
| Stores         | camelCase with `Store` suffix | `BookStore.ts`                    |
| Utilities      | camelCase                     | `caculateBook.ts`                 |
| Models/Classes | PascalCase                    | `Book.ts`, `Cursor.ts`            |
| Constants      | UPPER_SNAKE_CASE              | `MAX_LINES`                       |
| Private fields | Prefix with `#`               | `#bookChapters`                   |
| File exports   | Default export for pages      | `export default function Index()` |

### Component Structure

Follow this pattern for React components:

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  title: string;
}

const ComponentName = ({ title }: Props) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ComponentName;
```

### StyleSheet Rules

- Place `StyleSheet.create` at the end of the file, after the component
- Use StyleSheet.create for all styling (no inline objects for reusable styles)
- Use numeric values instead of strings where possible
- Organize properties: flex-related first, then dimensions, then colors

### Error Handling

- Use `console.error` for error logging in catch blocks
- Always wrap async operations in try/catch
- Return user-friendly fallback UI on errors
- Use `ActivityIndicator` for loading states

### State Management (Zustand)

Pattern for Zustand stores:

```typescript
import { create } from 'zustand';

interface StoreState {
  items: Item[];
  addItem: (item: Item) => void;
  removeItem: (id: string) => void;
}

const useStore = create<StoreState>((set) => ({
  items: [],
  addItem: (item) => {
    set((state) => ({
      items: [...state.items, item],
    }));
  },
  removeItem: (id) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }));
  },
}));

export default useStore;
```

## Known Issues and Typos

The codebase contains some typos that should NOT be perpetuated:

- "chacpter" → "chapter"
- "caculate" → "calculate"
- "Chacpter" → "Chapter"

When making changes, use correct spelling. When fixing typos, update all references.

## Directory Structure

```
/app           - Expo Router pages and layouts
/components    - Reusable UI components
/hooks         - Custom React hooks
/models        - TypeScript interfaces and classes
/stores        - Zustand state stores
/utils         - Utility functions
/assets        - Static assets (fonts, images)
/.expo         - Expo configuration
```

## Path Alias

Use `@/` prefix for absolute imports from root:

```typescript
import BookCover from '@/components/BookCover';
import { Book } from '@/models/Book';
```

## Important File Locations

- ESLint config: `eslint.config.mjs`
- TypeScript config: `tsconfig.json`
- Prettier config: `.prettierrc`
- App configuration: `app.json`
- Babel config: `babel.config.js`

## Development Workflow

1. Run `bun typecheck` before committing
2. Run `bun format` to auto-format changes
3. Run `bun lint` to check code quality
4. Use `bun start` for live development with hot reload

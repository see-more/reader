**<p align="center">Reader</p>**
_<p align="center">React Native Implement Read Book App</p>_
**<p align="center">Just read local book</p>**

## Version

Current version: **1.0.0**

### Dependency Updates

The project uses the following key versions:

- **React Native**: 0.84.0
- **React**: 19.2.4
- **Expo SDK**: 54
- **TypeScript**: 5.x (strict mode enabled)

### Latest Changes

- Upgraded to React Native 0.84.0
- Updated Expo to SDK 54
- Migrated to React 19
- Added TypeScript strict mode
- Integrated testing with Jest
- Added ESLint and Prettier for code quality

## Quick Start

### Prerequisites

Ensure you have the following installed:
- Node.js (v18+)
- Bun (recommended) or npm/yarn
- Expo CLI (optional, for local development)
- For iOS: Xcode (macOS only)
- For Android: Android Studio

### Installation

1. Clone the repository and navigate to the project directory:
   ```bash
   cd /root/.openclaw/workspace/reader
   ```

2. Install dependencies using Bun (recommended):
   ```bash
   bun install
   ```

   Or using npm:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   bun start
   ```

4. To preview on a physical device, use:
   ```bash
   bun run tunnel
   ```

## Common Commands

### Development

| Command | Description |
|---------|-------------|
| `bun start` | Start Expo development server |
| `bun run tunnel` | Start Expo with tunnel (access over network) |
| `bun run android` | Run on Android emulator/device |
| `bun run ios` | Run on iOS simulator/device |
| `bun run web` | Run in web browser |
| `bun run clean` | Clear cache and restart |

### Code Quality

| Command | Description |
|---------|-------------|
| `bun run typecheck` | Run TypeScript type checking |
| `bun run lint` | Run ESLint to check code quality |
| `bun run format` | Format code with Prettier |

### Testing

| Command | Description |
|---------|-------------|
| `bun test` | Run all tests |
| `bun run test:watch` | Run tests in watch mode |
| `bun run test:coverage` | Generate test coverage report |

## Project Structure

```
reader/
├── app/              # Expo Router pages
├── components/       # Reusable components
├── hooks/            # Custom React hooks
├── store/            # Zustand state management
├── utils/            # Utility functions
├── __tests__/        # Test files
└── jest.setup.js     # Jest configuration
```

## Technology Stack

- **Framework**: React Native 0.84.0 + Expo 54
- **Routing**: Expo Router
- **State Management**: Zustand
- **Styling**: React Native Skia
- **TypeScript**: Strict mode enabled
- **Testing**: Jest + Testing Library

## TODO

- [ ] Refactor app structure
- [ ] Add chapter list component
- [ ] Add search
- [ ] Store book data in local storage
- [x] CalculateBookPage function optimize performance
- [ ] Add gesture controller to change page

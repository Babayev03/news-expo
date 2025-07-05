# 📰 News App

A modern, feature-rich news application built with React Native and Expo. Stay updated with the latest news from various sources with a beautiful, intuitive interface that supports both light and dark themes.

## ✨ Features

- 🌐 **Latest News**: Browse trending news articles from multiple sources
- ❤️ **Favorites**: Save articles to read later
- 🌙 **Dark/Light Theme**: Seamless theme switching
- 📱 **Responsive Design**: Optimized for all device sizes
- 🎨 **Beautiful UI**: Modern design with smooth animations
- 🔄 **Offline Support**: Cache articles for offline reading
- 📊 **Categories**: Filter news by different categories
- 🔍 **Search**: Find specific articles quickly
- 🎯 **Animated Headers**: Smooth scrolling titles with fade effects
- 🚀 **Performance**: Fast loading with optimized images

## 🛠️ Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v7
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Animations**: React Native Reanimated & Moti
- **Storage**: MMKV (Fast & Encrypted)
- **Styling**: StyleSheet with Design System
- **Icons**: Expo Vector Icons
- **Network**: Axios with offline detection

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **iOS Simulator** (for iOS development)
- **Android Studio** (for Android development)

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd news
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your configuration (see [Environment Variables](#environment-variables) section)

4. **Prebuild the project**
   ```bash
   npx expo prebuild
   ```
   This generates native code for iOS and Android platforms.

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
EXPO_PUBLIC_BASE_URL=https://api.example.com
EXPO_PUBLIC_API_KEY=your_news_api_key_here

# Storage Encryption
EXPO_PUBLIC_MMKV_ENCRYPTION_KEY=your_secure_encryption_key_here
```

### Environment Variables Explained

- **`EXPO_PUBLIC_BASE_URL`**: Base URL for your news API service
- **`EXPO_PUBLIC_API_KEY`**: API key for accessing news data
- **`EXPO_PUBLIC_MMKV_ENCRYPTION_KEY`**: Encryption key for secure local storage

## 🎯 Running the Application

### Development Mode

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on web browser
npm run web
```

### Production Build

```bash
# Build for production
npx expo build:android
npx expo build:ios
```

## 📁 Project Structure

```
news/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── common/         # Common components (LoadingSpinner, etc.)
│   │   └── news/           # News-specific components
│   ├── hooks/              # Custom React hooks
│   ├── navigation/         # Navigation configuration
│   ├── screens/            # Screen components
│   │   ├── home/          # Home screen
│   │   ├── favorite/      # Favorites screen
│   │   └── news-detail/   # News detail screen
│   ├── services/           # API and storage services
│   │   ├── api/           # API calls and client
│   │   └── storage/       # Local storage (MMKV)
│   ├── store/             # Global state management
│   ├── styles/            # Design system (colors, typography, spacing)
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions and constants
├── assets/                 # Static assets (images, fonts)
├── App.tsx                # Main app component
├── app.json               # Expo configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Key Components

### AnimatedHeaderTitle

A beautiful animated header component that:

- Displays scrolling text with fade effects
- Supports theme switching
- Includes back navigation and favorite toggle
- Starts animation after 1-second delay

### NewsCard

Modern news card component featuring:

- Article image with loading states
- Category badges
- Author and publication date
- Smooth animations and interactions

### LoadingSpinner & SkeletonCard

Optimized loading states for better UX:

- Skeleton screens while loading
- Smooth transitions between states
- Theme-aware styling

## 🔄 State Management

The app uses Zustand for efficient state management:

- **News Store**: Manages articles, favorites, and filters
- **Theme Store**: Handles light/dark theme switching
- **Persistent Storage**: Automatic state persistence with MMKV

## 🌐 API Integration

The app integrates with news APIs through:

- **Axios client** with interceptors
- **TanStack Query** for caching and synchronization
- **Offline support** with cached data
- **Error handling** with retry mechanisms

## 🎭 Theming

Built-in support for light and dark themes:

- **Dynamic colors** that adapt to system preferences
- **Consistent design tokens** across all components
- **Smooth transitions** between themes
- **Accessibility** compliance

## 📱 Platform Support

- **iOS**: Native performance with platform-specific optimizations
- **Android**: Material Design guidelines compliance
- **Web**: Responsive design for web browsers (experimental)

## 🔧 Development Scripts

```bash
# Linting and formatting
npm run lint          # Check code quality
npm run format        # Auto-fix formatting issues

# Development
npm start            # Start development server
npm run ios          # Run on iOS
npm run android      # Run on Android
npm run web          # Run on web browser
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using React Native and Expo**

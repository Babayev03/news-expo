// App-wide constants
export const APP_CONFIG = {
  name: 'News App',
  version: '1.0.0',
  description: 'A modern news application',
} as const;

export const API_CONFIG = {
  // NewsAPI configuration
  newsApiUrl: process.env.EXPO_PUBLIC_BASE_URL || '',
  newsApiKey: process.env.EXPO_PUBLIC_API_KEY || '',
  timeout: 15000,
  retryAttempts: 3,
} as const;

export const STORAGE_KEYS = {
  favorites: 'favorites',
  user: 'user',
  settings: 'settings',
  theme: 'theme',
} as const;

export const THEME_CONFIG = {
  colors: {
    primary: '#007AFF',
    secondary: '#5856D6',
    success: '#34C759',
    warning: '#FF9500',
    error: '#FF3B30',
    background: '#F2F2F7',
    surface: '#FFFFFF',
    text: '#000000',
    textSecondary: '#8E8E93',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
} as const;

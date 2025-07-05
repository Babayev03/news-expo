import { MMKV, Mode } from 'react-native-mmkv';
import { STORAGE_KEYS } from '~/utils/constants';

// Initialize MMKV instance
export const storage = new MMKV({
  id: `storage`,
  encryptionKey: process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY,
  mode: Mode.MULTI_PROCESS,
  readOnly: false,
});

// Type-safe storage operations
export const StorageService = {
  // Generic set/get methods
  set: <T>(key: string, value: T): void => {
    try {
      storage.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting storage value:', error);
    }
  },

  get: <T>(key: string): T | null => {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Error getting storage value:', error);
      return null;
    }
  },

  remove: (key: string): void => {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Error removing storage value:', error);
    }
  },

  clear: (): void => {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  },

  // Specific methods for app data
  getFavorites: (): string[] => {
    return StorageService.get<string[]>(STORAGE_KEYS.favorites) || [];
  },

  setFavorites: (favorites: string[]): void => {
    StorageService.set(STORAGE_KEYS.favorites, favorites);
  },

  addFavorite: (articleId: string): void => {
    const favorites = StorageService.getFavorites();
    if (!favorites.includes(articleId)) {
      favorites.push(articleId);
      StorageService.setFavorites(favorites);
    }
  },

  removeFavorite: (articleId: string): void => {
    const favorites = StorageService.getFavorites();
    const updatedFavorites = favorites.filter((id) => id !== articleId);
    StorageService.setFavorites(updatedFavorites);
  },

  isFavorite: (articleId: string): boolean => {
    const favorites = StorageService.getFavorites();
    return favorites.includes(articleId);
  },
};

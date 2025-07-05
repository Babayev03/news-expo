import { useState, useEffect, useCallback } from 'react';
import { StorageService } from '~/services/storage/mmkv';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from storage on mount
  useEffect(() => {
    const savedFavorites = StorageService.getFavorites();
    setFavorites(savedFavorites);
  }, []);

  // Add article to favorites
  const addFavorite = useCallback((articleId: string) => {
    setFavorites((prev) => {
      if (!prev.includes(articleId)) {
        const newFavorites = [...prev, articleId];
        StorageService.setFavorites(newFavorites);
        return newFavorites;
      }
      return prev;
    });
  }, []);

  // Remove article from favorites
  const removeFavorite = useCallback((articleId: string) => {
    setFavorites((prev) => {
      const newFavorites = prev.filter((id) => id !== articleId);
      StorageService.setFavorites(newFavorites);
      return newFavorites;
    });
  }, []);

  // Toggle favorite status
  const toggleFavorite = useCallback(
    (articleId: string) => {
      if (favorites.includes(articleId)) {
        removeFavorite(articleId);
      } else {
        addFavorite(articleId);
      }
    },
    [favorites, addFavorite, removeFavorite]
  );

  // Check if article is favorite
  const isFavorite = useCallback(
    (articleId: string) => {
      return favorites.includes(articleId);
    },
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    favoritesCount: favorites.length,
  };
}

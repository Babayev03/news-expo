import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { NewsArticle, NewsFilter } from '~/types/news';
import { StorageService } from '~/services/storage/mmkv';

interface NewsState {
  // News data
  articles: NewsArticle[];
  favorites: string[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;

  // Offline state
  isOffline: boolean;
  lastSyncTime: number;

  // Actions
  setArticles: (articles: NewsArticle[]) => void;
  addArticles: (articles: NewsArticle[]) => void;
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setHasMore: (hasMore: boolean) => void;
  setPage: (page: number) => void;
  incrementPage: () => void;

  // Favorites
  addFavorite: (articleId: string) => void;
  removeFavorite: (articleId: string) => void;
  toggleFavorite: (articleId: string) => void;
  isFavorite: (articleId: string) => boolean;
  getFavoriteArticles: () => NewsArticle[];

  // Offline
  setOffline: (offline: boolean) => void;
  updateSyncTime: () => void;

  // Reset
  reset: () => void;

  // Clear articles (for fresh app start)
  clearArticles: () => void;
}

// MMKV storage adapter for Zustand
const mmkvStorage = {
  getItem: (name: string) => {
    const value = StorageService.get<any>(name);
    return value ? JSON.stringify(value) : null;
  },
  setItem: (name: string, value: string) => {
    StorageService.set(name, JSON.parse(value));
  },
  removeItem: (name: string) => {
    StorageService.remove(name);
  },
};

export const useNewsStore = create<NewsState>()(
  persist(
    (set, get) => ({
      // Initial state
      articles: [],
      favorites: [],
      isLoading: true,
      isLoadingMore: false,
      error: null,
      hasMore: true,
      page: 1,
      isOffline: false,
      lastSyncTime: 0,

      // News actions
      setArticles: (articles) => set({ articles }),
      addArticles: (newArticles) =>
        set((state) => ({
          articles: [...state.articles, ...newArticles],
        })),
      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingMore: (loading) => set({ isLoadingMore: loading }),
      setError: (error) => set({ error }),
      setHasMore: (hasMore) => set({ hasMore }),
      setPage: (page) => set({ page }),
      incrementPage: () => set((state) => ({ page: state.page + 1 })),

      // Favorites actions
      addFavorite: (articleId) =>
        set((state) => ({
          favorites: state.favorites.includes(articleId)
            ? state.favorites
            : [...state.favorites, articleId],
        })),
      removeFavorite: (articleId) =>
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== articleId),
        })),
      toggleFavorite: (articleId) => {
        const state = get();
        if (state.favorites.includes(articleId)) {
          state.removeFavorite(articleId);
        } else {
          state.addFavorite(articleId);
        }
      },
      isFavorite: (articleId) => get().favorites.includes(articleId),
      getFavoriteArticles: () => {
        const state = get();
        return state.articles.filter((article) => state.favorites.includes(article.id));
      },

      // Offline actions
      setOffline: (offline) => set({ isOffline: offline }),
      updateSyncTime: () => set({ lastSyncTime: Date.now() }),

      // Reset
      reset: () =>
        set({
          articles: [],
          isLoading: false,
          isLoadingMore: false,
          error: null,
          hasMore: true,
          page: 1,
        }),

      // Clear articles (for fresh app start)
      clearArticles: () => set({ articles: [] }),
    }),
    {
      name: 'news-store',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        favorites: state.favorites,
        lastSyncTime: state.lastSyncTime,
      }),
    }
  )
);

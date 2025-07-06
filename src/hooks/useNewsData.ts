import { useEffect, useCallback } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useNewsStore } from '~/store/newsStore';
import { newsApi } from '~/services/api/news';

export function useNewsData() {
  const {
    articles,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    page,
    isOffline,
    setArticles,
    addArticles,
    setLoading,
    setLoadingMore,
    setError,
    setHasMore,
    incrementPage,
    setOffline,
    updateSyncTime,
    setPage,
    clearArticles,
  } = useNewsStore();

  // Monitor network connectivity
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setOffline(!state.isConnected);
    });

    return unsubscribe;
  }, [setOffline]);

  // Fetch initial news data
  const fetchNews = useCallback(
    async (refresh = false) => {
      // Always show loading state during fetch process
      setLoading(true);
      setError(null);

      if (refresh) {
        setPage(1);
        // Clear cache when explicitly refreshing
        newsApi.clearCache();
      }

      try {
        const response = await newsApi.getNews(1, 10);
        setArticles(response.data);
        setHasMore(response.hasMore);
        updateSyncTime();
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch news';
        setError(errorMessage);
        console.error('Error fetching news:', err);
      } finally {
        setLoading(false);
      }
    },
    [setArticles, setLoading, setError, setHasMore, updateSyncTime, setPage]
  );

  // Load more articles for infinite scroll
  const loadMoreNews = useCallback(async () => {
    if (isLoadingMore || !hasMore || isLoading) return;

    setLoadingMore(true);
    setError(null);

    try {
      const nextPage = page + 1;
      const response = await newsApi.getNews(nextPage, 10);

      if (response.data.length > 0) {
        addArticles(response.data);
        incrementPage();
        setHasMore(response.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load more news';
      setError(errorMessage);
      console.error('Error loading more news:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [
    isLoadingMore,
    hasMore,
    isLoading,
    page,
    addArticles,
    incrementPage,
    setLoadingMore,
    setError,
    setHasMore,
  ]);

  // Refresh news data
  const refreshNews = useCallback(async () => {
    await fetchNews(true);
  }, [fetchNews]);

  // Initialize data on mount
  useEffect(() => {
    // Clear articles on app start to show empty state initially
    clearArticles();
    // Always fetch fresh data on app launch
    fetchNews();
  }, [fetchNews, clearArticles]);

  return {
    articles,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    isOffline,
    refreshNews,
    loadMoreNews,
  };
}

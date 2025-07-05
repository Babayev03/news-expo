import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { newsApi } from '~/services/api/news';
import { NewsFilter } from '~/types/news';

// Hook for fetching news with pagination
export function useNews(filters?: NewsFilter, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['news', filters],
    queryFn: ({ pageParam = 1 }) => newsApi.getNews(pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
}

// Hook for fetching single news article
export function useNewsArticle(id: string) {
  return useQuery({
    queryKey: ['news', id],
    queryFn: () => newsApi.getNewsById(id),
    enabled: !!id,
  });
}

// Hook for fetching news categories
export function useNewsCategories() {
  return useQuery({
    queryKey: ['news-categories'],
    queryFn: newsApi.getCategories,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Hook for searching news
export function useSearchNews(query: string, limit = 10) {
  return useInfiniteQuery({
    queryKey: ['search-news', query],
    queryFn: ({ pageParam = 1 }) => newsApi.searchNews(query, pageParam, limit),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!query.trim(),
  });
}

// Hook for trending news
export function useTrendingNews(limit = 10) {
  return useQuery({
    queryKey: ['trending-news', limit],
    queryFn: () => newsApi.getTrendingNews(limit),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

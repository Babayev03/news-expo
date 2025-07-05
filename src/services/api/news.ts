import apiClient from './client';
import { NewsArticle, NewsCategory } from '~/types/news';
import { PaginatedResponse } from '~/types/common';
import { StorageService } from '~/services/storage/mmkv';

// Cache keys
const CACHE_KEYS = {
  articles: 'cached_articles',
  categories: 'cached_categories',
  lastFetch: 'last_fetch_time',
} as const;

// Cache duration (1 hour)
const CACHE_DURATION = 60 * 60 * 1000;

// Check if cache is valid
const isCacheValid = (): boolean => {
  const lastFetch = StorageService.get<number>(CACHE_KEYS.lastFetch);
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_DURATION;
};

// Get cached articles
const getCachedArticles = (): NewsArticle[] => {
  return StorageService.get<NewsArticle[]>(CACHE_KEYS.articles) || [];
};

// Cache articles
const cacheArticles = (articles: NewsArticle[]): void => {
  StorageService.set(CACHE_KEYS.articles, articles);
  StorageService.set(CACHE_KEYS.lastFetch, Date.now());
};

// Transform NewsAPI response to our NewsArticle format
const transformNewsApiArticle = (item: any): NewsArticle => {
  const now = new Date().toISOString();

  return {
    id: `newsapi-${Date.now()}-${Math.random()}`,
    title: item.title || 'No title',
    content: item.content || item.description || 'No content available',
    summary: item.description || 'No summary available',
    imageUrl:
      item.urlToImage || `https://picsum.photos/400/300?random=${Math.floor(Math.random() * 1000)}`,
    author: item.author || item.source?.name || 'Unknown Author',
    publishedAt: item.publishedAt || now,
    category: {
      id: 'general',
      name: item.source?.name || 'General',
      slug: 'general',
    },
    tags: ['news'],
    sourceUrl: item.url || '',
    isBookmarked: false,
    createdAt: now,
    updatedAt: now,
  };
};

// Fetch news articles using everything endpoint for better results
const fetchNewsArticles = async (page = 1, limit = 10): Promise<NewsArticle[]> => {
  try {
    const response = await apiClient.get('/everything', {
      params: {
        q: 'technology OR business OR sports OR health OR science', // General news topics
        sortBy: 'publishedAt',
        pageSize: limit,
        page: page,
        language: 'en',
      },
    });

    if (response.data.articles) {
      return response.data.articles.map(transformNewsApiArticle);
    }

    throw new Error('No articles found');
  } catch (error) {
    console.error('NewsAPI fetch failed:', error);

    // Fallback to top-headlines if everything fails
    try {
      const fallbackResponse = await apiClient.get('/top-headlines', {
        params: {
          country: 'us',
          pageSize: limit,
          page: page,
        },
      });

      if (fallbackResponse.data.articles) {
        return fallbackResponse.data.articles.map(transformNewsApiArticle);
      }
    } catch (fallbackError) {
      console.error('Top headlines fallback also failed:', fallbackError);
    }

    throw new Error('Failed to fetch news from all endpoints');
  }
};

// News API service
export const newsApi = {
  // Get paginated news articles
  getNews: async (page = 1, limit = 10): Promise<PaginatedResponse<NewsArticle>> => {
    try {
      // Check cache first for offline support
      if (page === 1 && isCacheValid()) {
        const cachedArticles = getCachedArticles();
        if (cachedArticles.length > 0) {
          const startIndex = (page - 1) * limit;
          const endIndex = startIndex + limit;
          const pageArticles = cachedArticles.slice(startIndex, endIndex);

          return {
            data: pageArticles,
            total: cachedArticles.length,
            page,
            limit,
            hasMore: endIndex < cachedArticles.length,
          };
        }
      }

      // Try to fetch from APIs
      const articles = await fetchNewsArticles(page, limit);

      // Cache the first page for offline access
      if (page === 1 && articles.length > 0) {
        const allCachedArticles = getCachedArticles();
        const updatedCache = [...articles, ...allCachedArticles.slice(limit)];
        cacheArticles(updatedCache.slice(0, 100)); // Keep max 100 articles cached
      }

      return {
        data: articles,
        total: articles.length * 5, // Simulate more pages
        page,
        limit,
        hasMore: page < 5, // Simulate 5 pages max
      };
    } catch (error) {
      console.error('Error fetching news:', error);

      // Return cached data if available
      const cachedArticles = getCachedArticles();
      if (cachedArticles.length > 0) {
        const startIndex = (page - 1) * limit;
        const endIndex = startIndex + limit;
        const pageArticles = cachedArticles.slice(startIndex, endIndex);

        return {
          data: pageArticles,
          total: cachedArticles.length,
          page,
          limit,
          hasMore: endIndex < cachedArticles.length,
        };
      }

      throw new Error('Failed to fetch news and no cached data available');
    }
  },

  // Get single news article (from cache or API)
  getNewsById: async (id: string): Promise<NewsArticle> => {
    const cachedArticles = getCachedArticles();
    const article = cachedArticles.find((a) => a.id === id);

    if (!article) {
      throw new Error('Article not found');
    }

    return article;
  },

  // Get news categories
  getCategories: async (): Promise<NewsCategory[]> => {
    const cached = StorageService.get<NewsCategory[]>(CACHE_KEYS.categories);
    if (cached) return cached;

    const categories: NewsCategory[] = [
      { id: '1', name: 'Technology', slug: 'technology' },
      { id: '2', name: 'Science', slug: 'science' },
      { id: '3', name: 'Business', slug: 'business' },
      { id: '4', name: 'Sports', slug: 'sports' },
      { id: '5', name: 'Health', slug: 'health' },
      { id: '6', name: 'Entertainment', slug: 'entertainment' },
    ];

    StorageService.set(CACHE_KEYS.categories, categories);
    return categories;
  },

  // Search news articles
  searchNews: async (
    query: string,
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<NewsArticle>> => {
    const params = new URLSearchParams({
      q: query,
      page: page.toString(),
      limit: limit.toString(),
    });

    const response = await apiClient.get(`/news/search?${params}`);
    return response.data;
  },

  // Get trending news
  getTrendingNews: async (limit = 10): Promise<NewsArticle[]> => {
    const response = await apiClient.get(`/news/trending?limit=${limit}`);
    return response.data;
  },

  // Clear cache (for refresh functionality)
  clearCache: (): void => {
    StorageService.remove(CACHE_KEYS.articles);
    StorageService.remove(CACHE_KEYS.lastFetch);
  },
};

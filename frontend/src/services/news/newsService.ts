import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { News, NewsInput } from '@/interfaces/News';

/* ------------------------ TOAST HANDLER WRAPPER ------------------------ */
const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn();
    toast.success(successMsg);
    return result;
  } catch (e: any) {
    toast.error(e?.message || errorMsg);
    return null;
  }
};

/* --------------------------- NEWS SERVICES ---------------------------- */

// ✅ Create a news article
export const createNews = async (data: NewsInput): Promise<News | null> =>
  withToast(
    () => apiRequest<News>('/news', 'POST', data),
    'News created successfully.',
    'Failed to create news.'
  );

// ✅ Get all news (with optional filters)
export const getAllNews = async (params: any = {}): Promise<{ news: News[]; total: number } | null> =>
  withToast(
    () => apiRequest<{ news: News[]; total: number }>('/news', 'GET', null, params),
    'Fetched news successfully.',
    'Failed to fetch news.'
  );

// ✅ Get a single news article
export const getNewsById = async (id: string): Promise<News | null> =>
  withToast(
    () => apiRequest<News>(`/news/${id}`, 'GET'),
    'News loaded successfully.',
    'Failed to load news.'
  );

// ✅ Update news
export const updateNewsById = async (id: string, data: Partial<NewsInput>): Promise<News | null> =>
  withToast(
    () => apiRequest<News>(`/news/${id}`, 'PUT', data),
    'News updated successfully.',
    'Failed to update news.'
  );

// ✅ Delete news
export const deleteNewsById = async (id: string): Promise<boolean | null> =>
  withToast(
    () => apiRequest(`/news/${id}`, 'DELETE'),
    'News deleted successfully.',
    'Failed to delete news.'
  );

// ✅ Increment views
export const incrementViews = async (id: string): Promise<void | null> =>
  withToast(
    () => apiRequest(`/news/${id}/views`, 'PATCH'),
    'View incremented.',
    'Failed to increment views.'
  );

// ✅ Get featured news
export const getFeaturedNews = async (): Promise<News[] | null> =>
  withToast(
    () => apiRequest<News[]>('/news/featured', 'GET'),
    'Fetched featured news.',
    'Failed to load featured news.'
  );

// ✅ Get breaking news
export const getBreakingNews = async (): Promise<News[] | null> =>
  withToast(
    () => apiRequest<News[]>('/news/breaking', 'GET'),
    'Fetched breaking news.',
    'Failed to load breaking news.'
  );

// ✅ Search news
export const searchNews = async (query: string, page = 1, limit = 10): Promise<{ news: News[]; total: number } | null> =>
  withToast(
    () =>
      apiRequest<{ news: News[]; total: number }>(
        `/news/search?query=${encodeURIComponent(query)}&page=${page}&limit=${limit}`,
        'GET'
      ),
    'Search completed.',
    'Search failed.'
  );

// ✅ Get news by category
export const getNewsByCategory = async (categoryId: string, page = 1, limit = 10): Promise<{ news: News[]; total: number } | null> =>
  withToast(
    () =>
      apiRequest<{ news: News[]; total: number }>(
        `/news/category/${categoryId}?page=${page}&limit=${limit}`,
        'GET'
      ),
    'Fetched category news.',
    'Failed to load news for category.'
  );

// ✅ Get recent news
export const getRecentNews = async (limit = 10): Promise<News[] | null> =>
  withToast(
    () => apiRequest<News[]>(`/news/recent?limit=${limit}`, 'GET'),
    'Fetched recent news.',
    'Failed to fetch recent news.'
  );

// ✅ Get news stats
export const getNewsStats = async (): Promise<{ totalNews: number; publishedNews: number; unpublishedNews: number } | null> =>
  withToast(
    () => apiRequest('/news/stats', 'GET'),
    'Fetched news stats.',
    'Failed to fetch statistics.'
  );

// ✅ Toggle breaking status
export const toggleBreakingNews = async (id: string): Promise<News | null> =>
  withToast(
    () => apiRequest<News>(`/news/${id}/toggle-breaking`, 'PATCH'),
    'Toggled breaking news status.',
    'Failed to toggle breaking status.'
  );

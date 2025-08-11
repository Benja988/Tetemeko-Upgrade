import { Podcast, Episode } from '@/interfaces/podcasts'; // Ensure Episode interface is defined
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

// Interface for pagination response (aligned with backend)
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

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
    console.error(`❌ ${errorMsg}:`, e.message);
    return null;
  }
};

/* ------------------------- PODCAST SERVICES --------------------------- */

// ✅ Create a podcast (Admin only)
export const createPodcast = async (data: FormData): Promise<Podcast | null> =>
  withToast(
    () => apiRequest<Podcast>('/podcasts', 'POST', data),
    'Podcast created successfully.',
    'Failed to create podcast.'
  );

// ✅ Get all podcasts (public)
export const getAllPodcasts = async (
  params: {
    category?: string;
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedResponse<Podcast> | null> =>
  withToast(
    () => {
      const query = new URLSearchParams();
      if (params.category) query.append('category', params.category);
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      return apiRequest<PaginatedResponse<Podcast>>(
        `/podcasts?${query.toString()}`,
        'GET'
      );
    },
    'Fetched podcasts successfully.',
    'Failed to fetch podcasts.'
  );

// ✅ Get a single podcast by ID (public)
export const getPodcastById = async (id: string): Promise<Podcast | null> =>
  withToast(
    () => apiRequest<Podcast>(`/podcasts/${id}`, 'GET'),
    'Fetched podcast successfully.',
    'Failed to fetch podcast.'
  );

// ✅ Update podcast (Admin only)
export const updatePodcastById = async (
  id: string,
  data: FormData
): Promise<Podcast | null> =>
  withToast(
    () => apiRequest<Podcast>(`/podcasts/${id}`, 'PUT', data),
    'Podcast updated successfully.',
    'Failed to update podcast.'
  );

// ✅ Delete podcast (Admin only)
export const deletePodcastById = async (id: string): Promise<boolean | null> =>
  withToast(
    () => apiRequest(`/podcasts/${id}`, 'DELETE').then(() => true),
    'Podcast deleted successfully.',
    'Failed to delete podcast.'
  );

// ✅ Toggle podcast status (Admin only)
export const togglePodcastStatus = async (id: string): Promise<Podcast | null> =>
  withToast(
    () => apiRequest<Podcast>(`/podcasts/${id}/status`, 'PATCH'),
    'Toggled podcast status.',
    'Failed to toggle podcast status.'
  );

/* ------------------------- EPISODE SERVICES --------------------------- */

// ✅ Add episode to a podcast (Admin only)
export const addEpisode = async (
  podcastId: string,
  data: FormData
): Promise<Episode | null> =>
  withToast(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes`, 'POST', data),
    'Episode created successfully.',
    'Failed to create episode.'
  );

// ✅ Get all episodes for a podcast (public)
export const getAllEpisodes = async (
  podcastId: string,
  params: {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}
): Promise<PaginatedResponse<Episode> | null> =>
  withToast(
    () => {
      const query = new URLSearchParams();
      if (params.page) query.append('page', params.page.toString());
      if (params.limit) query.append('limit', params.limit.toString());
      if (params.search) query.append('search', params.search);
      if (params.sortBy) query.append('sortBy', params.sortBy);
      if (params.sortOrder) query.append('sortOrder', params.sortOrder);
      return apiRequest<PaginatedResponse<Episode>>(
        `/podcasts/${podcastId}/episodes?${query.toString()}`,
        'GET'
      );
    },
    'Fetched episodes successfully.',
    'Failed to fetch episodes.'
  );

// ✅ Get a single episode by ID (public)
export const getEpisodeById = async (
  podcastId: string,
  episodeId: string
): Promise<Episode | null> =>
  withToast(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes/${episodeId}`, 'GET'),
    'Fetched episode successfully.',
    'Failed to fetch episode.'
  );

// ✅ Update episode (Admin only)
export const updateEpisodeById = async (
  podcastId: string,
  episodeId: string,
  data: FormData
): Promise<Episode | null> =>
  withToast(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes/${episodeId}`, 'PUT', data),
    'Episode updated successfully.',
    'Failed to update episode.'
  );

// ✅ Delete episode (Admin only)
export const deleteEpisodeById = async (
  podcastId: string,
  episodeId: string
): Promise<boolean | null> =>
  withToast(
    () => apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, 'DELETE').then(() => true),
    'Episode deleted successfully.',
    'Failed to delete episode.'
  );
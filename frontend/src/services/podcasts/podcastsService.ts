import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Podcast, Episode } from '@/interfaces/podcasts';
import { retry } from '@/utils/utils';


// Interface for pagination response
interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Interface for API error response
interface APIErrorResponse {
  message: string;
  statusCode?: number;
}

// Input validation schemas
interface PodcastInput {
  title: string;
  description: string;
  category: string;
  station?: string;
  coverImage?: string | File;
}

interface EpisodeInput {
  title: string;
  description: string;
  duration: number;
  episodeNumber?: number;
  tags?: string[];
  audioUrl?: string | File;
}

// Validation functions
const validatePodcastInput = (data: PodcastInput): void => {
  if (!data.title || typeof data.title !== 'string' || data.title.length < 1 || data.title.length > 200) {
    throw new Error('Title must be 1-200 characters');
  }
  if (!data.description || typeof data.description !== 'string' || data.description.length < 1) {
    throw new Error('Description is required');
  }
  if (!data.category || !/^[0-9a-fA-F]{24}$/.test(data.category)) {
    throw new Error('Valid category ID is required');
  }
  if (data.station && !/^[0-9a-fA-F]{24}$/.test(data.station)) {
    throw new Error('Invalid station ID');
  }
  if (data.coverImage && typeof data.coverImage === 'string' && !data.coverImage.startsWith('http')) {
    throw new Error('Invalid cover image URL');
  }
};

const validateEpisodeInput = (data: EpisodeInput): void => {
  if (!data.title || typeof data.title !== 'string' || data.title.length < 1 || data.title.length > 200) {
    throw new Error('Title must be 1-200 characters');
  }
  if (!data.description || typeof data.description !== 'string' || data.description.length < 1) {
    throw new Error('Description is required');
  }
  if (typeof data.duration !== 'number' || data.duration <= 0) {
    throw new Error('Duration must be a positive number');
  }
  if (data.episodeNumber !== undefined && (typeof data.episodeNumber !== 'number' || data.episodeNumber <= 0)) {
    throw new Error('Episode number must be a positive number');
  }
  if (data.tags && (!Array.isArray(data.tags) || data.tags.some(t => typeof t !== 'string'))) {
    throw new Error('Tags must be an array of strings');
  }
  if (data.audioUrl && typeof data.audioUrl === 'string' && !data.audioUrl.startsWith('http')) {
    throw new Error('Invalid audio URL');
  }
};

// Toast wrapper with retry logic
const withToastAndRetry = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string,
  retryCount = 2
): Promise<T | null> => {
  try {
    const result = await retry(fn, { retries: retryCount, initialDelay: 1000 });
    toast.success(successMsg);
    return result;
  } catch (e: any) {
    const errorMessage = (e as APIErrorResponse).message || errorMsg;
    toast.error(errorMessage);
    console.error(`❌ ${errorMsg}:`, e.message);
    return null;
  }
};


// Podcast Services
export const createPodcast = async (data: PodcastInput): Promise<Podcast | null> => {
  validatePodcastInput(data);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return withToastAndRetry(
    () => apiRequest<Podcast>('/podcasts', 'POST', formData),
    'Podcast created successfully.',
    'Failed to create podcast.'
  );
};

export const getAllPodcasts = async (params: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<{ podcasts: Podcast[]; pagination: any } | null> => {
  const query = new URLSearchParams();
  if (params.category) query.append('category', params.category);
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  return withToastAndRetry(
    () => apiRequest<{ podcasts: Podcast[]; pagination: any }>(`/podcasts?${query.toString()}`, 'GET'),
    'Fetched podcasts successfully.',
    'Failed to fetch podcasts.'
  );
};

export const getPodcastById = async (id: string): Promise<Podcast | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    toast.error('Invalid podcast ID');
    return null;
  }

  return withToastAndRetry(
    () => apiRequest<Podcast>(`/podcasts/${id}`, 'GET'),
    'Fetched podcast successfully.',
    'Failed to fetch podcast.'
  );
};

export const updatePodcastById = async (id: string, data: Partial<PodcastInput>): Promise<Podcast | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    toast.error('Invalid podcast ID');
    return null;
  }
  validatePodcastInput(data as PodcastInput);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return withToastAndRetry(
    () => apiRequest<Podcast>(`/podcasts/${id}`, 'PUT', formData),
    'Podcast updated successfully.',
    'Failed to update podcast.'
  );
};

export const deletePodcastById = async (id: string): Promise<boolean | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    toast.error('Invalid podcast ID');
    return null;
  }

  return withToastAndRetry(
    () => apiRequest(`/podcasts/${id}`, 'DELETE').then(() => true),
    'Podcast deleted successfully.',
    'Failed to delete podcast.'
  );
};

export const togglePodcastStatus = async (id: string): Promise<Podcast | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    toast.error('Invalid podcast ID');
    return null;
  }

  return withToastAndRetry(
    () => apiRequest<Podcast>(`/podcasts/${id}/status`, 'PATCH'),
    'Toggled podcast status.',
    'Failed to toggle podcast status.'
  );
};

// Episode Services
export const addEpisode = async (podcastId: string, data: EpisodeInput): Promise<Episode | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(podcastId)) {
    toast.error('Invalid podcast ID');
    return null;
  }
  validateEpisodeInput(data);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return withToastAndRetry(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes`, 'POST', formData),
    'Episode created successfully.',
    'Failed to create episode.'
  );
};

export const getAllEpisodes = async (podcastId: string, params: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
} = {}): Promise<PaginatedResponse<Episode> | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(podcastId)) {
    toast.error('Invalid podcast ID');
    return null;
  }

  const query = new URLSearchParams();
  if (params.page) query.append('page', params.page.toString());
  if (params.limit) query.append('limit', params.limit.toString());
  if (params.search) query.append('search', params.search);
  if (params.sortBy) query.append('sortBy', params.sortBy);
  if (params.sortOrder) query.append('sortOrder', params.sortOrder);

  return withToastAndRetry(
    () => apiRequest<PaginatedResponse<Episode>>(`/podcasts/${podcastId}/episodes?${query.toString()}`, 'GET'),
    'Fetched episodes successfully.',
    'Failed to fetch episodes.'
  );
};

export const getEpisodeById = async (podcastId: string, episodeId: string): Promise<Episode | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(podcastId) || !/^[0-9a-fA-F]{24}$/.test(episodeId)) {
    toast.error('Invalid podcast or episode ID');
    return null;
  }

  return withToastAndRetry(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes/${episodeId}`, 'GET'),
    'Fetched episode successfully.',
    'Failed to fetch episode.'
  );
};

export const updateEpisodeById = async (podcastId: string, episodeId: string, data: Partial<EpisodeInput>): Promise<Episode | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(podcastId) || !/^[0-9a-fA-F]{24}$/.test(episodeId)) {
    toast.error('Invalid podcast or episode ID');
    return null;
  }
  validateEpisodeInput(data as EpisodeInput);
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) {
      if (value instanceof File) {
        formData.append(key, value);
      } else if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else {
        formData.append(key, value.toString());
      }
    }
  });

  return withToastAndRetry(
    () => apiRequest<Episode>(`/podcasts/${podcastId}/episodes/${episodeId}`, 'PUT', formData),
    'Episode updated successfully.',
    'Failed to update episode.'
  );
};

export const deleteEpisodeById = async (podcastId: string, episodeId: string): Promise<boolean | null> => {
  if (!/^[0-9a-fA-F]{24}$/.test(podcastId) || !/^[0-9a-fA-F]{24}$/.test(episodeId)) {
    toast.error('Invalid podcast or episode ID');
    return null;
  }

  return withToastAndRetry(
    () => apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, 'DELETE').then(() => true),
    'Episode deleted successfully.',
    'Failed to delete episode.'
  );
};
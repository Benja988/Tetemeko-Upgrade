import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';
import { Episode } from '@/interfaces/podcasts';

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

/* ------------------------- EPISODE SERVICES --------------------------- */

// ✅ Add a new episode to a podcast
export const createEpisode = async (
  podcastId: string,
  data: FormData
): Promise<Episode | null> =>
  withToast(
    () =>
      apiRequest<Episode>(`/podcasts/${podcastId}/episodes`, 'POST', data),
    'Episode created successfully.',
    'Failed to create episode.'
  );

// ✅ Get all episodes for a podcast
export const getAllEpisodes = async (
  podcastId: string,
  params: Record<string, any> = {}
): Promise<{
  episodes: Episode[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} | null> =>
  withToast(
    () =>
      apiRequest(
        `/podcasts/${podcastId}/episodes`,
        'GET',
        null
      ),
    'Fetched episodes successfully.',
    'Failed to fetch episodes.'
  );

// ✅ Get an episode by ID
export const getEpisodeById = async (
  podcastId: string,
  episodeId: string
): Promise<Episode | null> => {
  try {
    return await apiRequest<Episode>(`/podcasts/${podcastId}/episodes/${episodeId}`, 'GET');
  } catch (error: any) {
    console.error('❌ Failed to fetch episode:', error.message);
    return null;
  }
};

// ✅ Update an episode
export const updateEpisodeById = async (
  podcastId: string,
  episodeId: string,
  data: FormData
): Promise<Episode | null> =>
  withToast(
    () =>
      apiRequest<Episode>(
        `/podcasts/${podcastId}/episodes/${episodeId}`,
        'PUT',
        data
      ),
    'Episode updated successfully.',
    'Failed to update episode.'
  );

// ✅ Delete an episode
export const deleteEpisodeById = async (
  podcastId: string,
  episodeId: string
): Promise<boolean | null> =>
  withToast(
    () =>
      apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, 'DELETE'),
    'Episode deleted successfully.',
    'Failed to delete episode.'
  );

import { Podcast } from '@/interfaces/podcasts';
import { apiRequest } from '@/lib/api';
import { toast } from 'sonner';

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
  params: Record<string, any> = {}
): Promise<{ podcasts: Podcast[]; total: number; page: number; limit: number; totalPages: number } | null> =>
  withToast(
    () => apiRequest('/podcasts', 'GET', null),
    'Fetched podcasts successfully.',
    'Failed to fetch podcasts.'
  );

// ✅ Get a single podcast by ID (public)
export const getPodcastById = async (id: string): Promise<Podcast | null> => {
  try {
    return await apiRequest<Podcast>(`/podcasts/${id}`, 'GET');
  } catch (error: any) {
    console.error('❌ Failed to fetch podcast by ID:', error.message);
    return null;
  }
};

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
    () => apiRequest(`/podcasts/${id}`, 'DELETE'),
    'Podcast deleted successfully.',
    'Failed to delete podcast.'
  );

// ✅ Toggle podcast status (Admin only)
export const togglePodcastStatus = async (id: string): Promise<Podcast | null> =>
  withToast(
    () => apiRequest<Podcast>(`/podcasts/${id}/toggle-status`, 'PATCH'),
    'Toggled podcast status.',
    'Failed to toggle podcast status.'
  );

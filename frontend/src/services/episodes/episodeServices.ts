import { apiRequest } from '@/lib/api';
import { Episode, PaginatedEpisodesResponse } from '@/interfaces/podcasts';
import { buildQueryParams } from '@/lib/api';

export const episodeService = {
  // Get all episodes for a podcast
  async getAll(
    podcastId: string,
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    }
  ): Promise<PaginatedEpisodesResponse> {
    const query = buildQueryParams(params);
    return apiRequest(`/podcasts/${podcastId}/episodes${query}`, "GET");
  },

  // Get a single episode
  async getById(
    podcastId: string,
    episodeId: string
  ): Promise<{ episode: Episode }> {
    return apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, "GET");
  },

  // Add episode (admin only)
  async create(
    podcastId: string,
    data: FormData
  ): Promise<{ message: string; episode: Episode }> {
    return apiRequest(`/podcasts/${podcastId}/episodes`, "POST", data);
  },

  // Update episode
  async update(
    podcastId: string,
    episodeId: string,
    data: FormData
  ): Promise<{ message: string; episode: Episode }> {
    return apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, "PUT", data);
  },

  // Delete episode
  async delete(
    podcastId: string,
    episodeId: string
  ): Promise<{ message: string }> {
    return apiRequest(`/podcasts/${podcastId}/episodes/${episodeId}`, "DELETE");
  },
};

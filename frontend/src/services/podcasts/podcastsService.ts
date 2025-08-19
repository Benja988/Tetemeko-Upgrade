import { apiRequest } from '@/lib/api';
import { Podcast, PaginatedPodcastsResponse } from '@/interfaces/podcasts';
import { buildQueryParams } from '@/lib/api';

const BASE_URL = '/podcasts';

export const podcastService = {
  // Get all podcasts with optional filters
  async getAll(params?: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Promise<PaginatedPodcastsResponse> {
    const query = buildQueryParams(params);
    return apiRequest(`${BASE_URL}${query}`, "GET");
  },

  // Get a single podcast by ID
  async getById(id: string): Promise<{ podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}`, "GET");
  },

  // Create podcast (admin only)
  async create(data: FormData): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}`, "POST", data);
  },

  // Update podcast
  async update(
    id: string,
    data: FormData
  ): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}`, "PUT", data);
  },

  // Delete podcast
  async delete(id: string): Promise<{ message: string }> {
    return apiRequest(`${BASE_URL}/${id}`, "DELETE");
  },

  // Toggle active/inactive
  async toggleStatus(id: string): Promise<{ message: string; podcast: Podcast }> {
    return apiRequest(`${BASE_URL}/${id}/toggle-status`, "PATCH");
  },
};

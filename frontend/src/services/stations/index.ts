import { apiRequest } from '@/lib/api'
import { toast } from 'sonner'
import { Station } from "@/interfaces/Station";

/* ------------------------- TOAST HANDLER WRAPPER ------------------------ */

const withToast = async <T>(
  fn: () => Promise<T>,
  successMsg: string,
  errorMsg: string
): Promise<T | null> => {
  try {
    const result = await fn()
    toast.success(successMsg)
    return result
  } catch (e: any) {
    toast.error(e.message || errorMsg)
    return null
  }
}

/* ---------------------------- STATION SERVICES ----------------------------- */

// Get all active stations
export const getStations = async (): Promise<Station[]> => {
  try {
    return await apiRequest<Station[]>('/stations')
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch stations.')
    return []
  }
}

// Get single station by ID
export const getStationById = async (id: string): Promise<Station | null> => {
  try {
    return await apiRequest<Station>(`/stations/${id}`)
  } catch (e: any) {
    toast.error(e.message || 'Failed to fetch station.')
    return null
  }
}

// Create a new station
export const createStation = async (data: Partial<Station>): Promise<Station | null> =>
  withToast(
    () => apiRequest<Station>('/stations', 'POST', data),
    'Station created successfully.',
    'Failed to create station.'
  )

// Update station
export const updateStation = async (
  id: string,
  data: Partial<Station>
): Promise<Station | null> =>
  withToast(
    () => apiRequest<Station>(`/stations/${id}`, 'PUT', data),
    'Station updated successfully.',
    'Failed to update station.'
  )

// Delete station
export const deleteStation = async (id: string): Promise<boolean> => {
  if (!id) {
    console.error("deleteStation called with invalid id:", id);
    return false;
  }
  try {
    const result = await withToast(
      async () => {
        await apiRequest(`/stations/${id}`, 'DELETE');
        return true;
      },
      'Station deleted successfully.',
      'Failed to delete station.'
    );
    return result ?? false;
  } catch (err) {
    console.error("Delete failed", err);
    return false;
  }
};




// Toggle station isActive status (admin only)
export const toggleStationStatus = async (id: string): Promise<Station | null> =>
  withToast(
    () => apiRequest<Station>(`/stations/${id}/toggle-status`, 'PATCH'),
    'Station status toggled successfully.',
    'Failed to toggle station status.'
  )

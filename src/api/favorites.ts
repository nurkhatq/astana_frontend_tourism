import { apiClient } from './client';
import { Place } from '../types';

export const favoritesApi = {
  getFavorites: async () => {
    const { data } = await apiClient.get<Place[]>('/users/profile/favorites/');
    return data;
  },

  toggleFavorite: async (placeId: number) => {
    const { data } = await apiClient.post('/users/profile/toggle_favorite/', {
      place_id: placeId,
    });
    return data;
  },
};
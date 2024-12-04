// src/hooks/usePlace.ts
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Place } from '../types';

export function usePlace(id: number) {
  return useQuery({
    queryKey: ['place', id],
    queryFn: async () => {
      if (id < 0) throw new Error('Invalid place ID');
      const { data } = await apiClient.get<Place>(`/places/${id}/`);
      return data;
    },
    enabled: id >= 0,
  });
}
export const usePlaceName = (placeId: number) => {
  return useQuery({
    queryKey: ['place-name', placeId],
    queryFn: async () => {
      const { data } = await apiClient.get(`/places/${placeId}/`);
      return data.name;
    },
  });
};
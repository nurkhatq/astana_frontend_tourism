import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Place } from '../types';

interface PlacesResponse {
  results: Place[];
  count: number;
  next: string | null;
  previous: string | null;
}

interface UsePlacesOptions {
  category?: string;
  search?: string;
  page?: number;
}

export const usePlaces = ({ category, search, page = 1 }: UsePlacesOptions = {}) => {
  return useQuery({
    queryKey: ['places', { category, search, page }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (page) params.append('page', page.toString());

      const { data } = await apiClient.get<PlacesResponse>('/places/', { params });
      return data;
    },
  });
};
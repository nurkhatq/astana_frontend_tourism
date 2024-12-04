// src/hooks/useReviews.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/client';
import { Review } from '../types';

export function useReviews(placeId: number) {
  return useQuery({
    queryKey: ['reviews', placeId],
    queryFn: async () => {
      const { data } = await apiClient.get<Review[]>(
        `/places/${placeId}/reviews/`
      );
      return data;
    },
    enabled: placeId > 0,
  });
}

export function useCreateReview(placeId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rating, comment }: { rating: number; comment: string }) => {
      const { data } = await apiClient.post(`/places/${placeId}/reviews/`, {
        rating,
        comment,
        place_id: placeId
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', placeId] });
      queryClient.invalidateQueries({ queryKey: ['place', placeId] });
    },
  });
}
// src/context/FavoritesContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { Place } from '../types';
import { useAuth } from './AuthContext';

interface FavoritesContextType {
  favorites: Place[];
  isFavorite: (placeId: number) => boolean;
  toggleFavorite: (place: Place) => Promise<void>;
}

interface FavoritesResponse {
  results: Place[];
  count: number;
  next: string | null;
  previous: string | null;
}

export const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Place[]>([]);
  const { isAuthenticated } = useAuth();

  const fetchFavorites = async () => {
    if (!isAuthenticated) {
      setFavorites([]);
      return;
    }
    
    try {
      const { data } = await apiClient.get('/users/favorites/');
      console.log('Fetched favorites:', data); // Debug log
      if (data.results) {
        setFavorites(data.results);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [isAuthenticated]);

  const toggleFavorite = async (place: Place) => {
    try {
      const response = await apiClient.post('/users/toggle-favorite/', { 
        place_id: place.id 
      });
      console.log('Toggle response:', response.data); // Debug log
      
      // Refetch favorites after toggling
      await fetchFavorites();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  };

  const isFavorite = (placeId: number) => {
    return favorites.some(fav => fav.id === placeId);
  };

  return (
    <FavoritesContext.Provider value={{ 
      favorites, 
      isFavorite, 
      toggleFavorite 
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
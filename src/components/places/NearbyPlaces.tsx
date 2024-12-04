// src/components/places/NearbyPlaces.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlaces } from '../../hooks/usePlaces';
import { Place } from '../../types';
import { Card } from '../ui/Card';

interface NearbyPlacesProps {
  currentPlace: Place;
}

export const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ currentPlace }) => {
  const navigate = useNavigate();
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);

  const { data: placesData, isLoading } = usePlaces({
    category: currentPlace.category,
  });

  useEffect(() => {
    if (placesData?.results) {
      const filtered = placesData.results
        .filter((place) => place.id !== currentPlace.id)
        .slice(0, 3);
      setNearbyPlaces(filtered);
    }
  }, [placesData, currentPlace.id]);

  if (isLoading) {
    return (
      <Card className="animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4">
                <div className="w-20 h-20 bg-gray-200 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (nearbyPlaces.length === 0) {
    return null;
  }

  const renderPlace = (place: Place) => {
    if (!place) return null;
    
    return (
      <button
        key={place.id}
        onClick={() => navigate(`/places/${place.id}`)}
        className="flex items-start gap-4 hover:bg-gray-50 p-2 rounded-lg transition-colors w-full text-left"
      >
        <img
          src={place.images?.[0]?.image || '/api/placeholder/80/80'}
          alt={place.name}
          className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">{place.name}</h4>
          <p className="text-sm text-gray-600 mt-1 truncate">{place.address}</p>
          <div className="flex items-center mt-1 space-x-2">
            {/* Google Rating */}
            {typeof place.google_rating === 'number' && (
              <div className="flex items-center">
                <span className="text-xs text-gray-500">G</span>
                <span className="text-sm font-medium text-gray-900 ml-1">
                  ⭐️ {place.google_rating.toFixed(1)}
                </span>
              </div>
            )}
  
            {/* Site Rating */}
            {typeof place.site_rating === 'number' && (
              <>
                <span className="text-gray-300">•</span>
                <div className="flex items-center">
                  <span className="text-xs text-blue-500">S</span>
                  <span className="text-sm font-medium text-gray-900 ml-1">
                    ⭐️ {place.site_rating.toFixed(1)}
                  </span>
                </div>
              </>
            )}
  
            <span className="text-gray-300">•</span>
            <span className="text-sm text-gray-600">
              {place.reviews_count || 0} reviews
            </span>
          </div>
        </div>
      </button>
    );
  };

  return (
    <Card>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-4">Nearby Places</h3>
        <div className="space-y-4">
          {nearbyPlaces.map((place) => renderPlace(place))}
        </div>
      </div>
    </Card>
  );
};
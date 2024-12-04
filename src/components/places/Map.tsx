// src/components/places/Map.tsx
import React from 'react';
import { MapPin } from 'lucide-react';
import { Place } from '../../types';

interface MapProps {
  place: Place;
  className?: string;
}

export const Map: React.FC<MapProps> = ({ place, className = '' }) => {
  const getGoogleMapsUrl = () => {
    const query = encodeURIComponent(`${place.name} ${place.address}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const getEmbedUrl = () => {
    return `https://www.google.com/maps/embed/v1/place?key=AIzaSyBHQ_sAOG7Nndu5soo5lAp6KDDRZIv4EBg&q=${encodeURIComponent(
      `${place.name} ${place.address}`
    )}&zoom=15`;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="h-64 w-full rounded-lg overflow-hidden">
        <iframe
          title="Google Maps"
          width="100%"
          height="100%"
          frameBorder="0"
          src={getEmbedUrl()}
          allowFullScreen
        />
      </div>
      
      <a
        href={getGoogleMapsUrl()}
        target="_blank"
        rel="noopener noreferrer"
        className="absolute bottom-4 right-4 bg-white rounded-full shadow-lg px-4 py-2 flex items-center gap-2 text-sm font-medium text-blue-600 hover:bg-blue-50 transition-colors"
      >
        <MapPin className="w-4 h-4" />
        View in Google Maps
      </a>
    </div>
  );
};
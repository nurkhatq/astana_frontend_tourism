import React from 'react';
import { PlaceImage } from '../../types';

interface PhotoGridProps {
  images: PlaceImage[];
  onImageClick: (index: number) => void;
}

export const PhotoGrid: React.FC<PhotoGridProps> = ({ images, onImageClick }) => {
  if (images.length === 0) {
    return (
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">No photos available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {images.slice(0, 8).map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick(index)}
          className={`relative aspect-square overflow-hidden rounded-lg
            ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
        >
          <img
            src={image.image}
            alt={`Place photo ${index + 1}`}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          {index === 7 && images.length > 8 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-xl font-medium">
                +{images.length - 8} more
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};
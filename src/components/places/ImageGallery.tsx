import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { PlaceImage } from '../../types';

interface ImageGalleryProps {
    images: PlaceImage[];
    onImageClick?: (index: number) => void;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="relative h-[400px] md:h-[500px]">
        {/* Main Image */}
        <div className="w-full h-full">
          <img
            src={images[currentIndex]?.image || '/api/placeholder/800/500'}
            alt="Place"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => setIsModalOpen(true)}
          />
        </div>

        {/* Thumbnail Strip */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2 p-2 bg-black bg-opacity-50 rounded-lg">
            {images.slice(0, 5).map((image, index) => (
              <button
                key={image.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-16 h-16 rounded overflow-hidden transition-opacity
                  ${currentIndex === index ? 'ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
              >
                <img
                  src={image.image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {images.length > 5 && (
              <button
                className="w-16 h-16 flex items-center justify-center bg-black bg-opacity-50 rounded text-white"
                onClick={() => setIsModalOpen(true)}
              >
                +{images.length - 5}
              </button>
            )}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-opacity"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-white bg-opacity-80 hover:bg-opacity-100 transition-opacity"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Full-screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black">
          <button
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-white hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="h-full flex items-center justify-center">
            <img
              src={images[currentIndex]?.image}
              alt="Place"
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};
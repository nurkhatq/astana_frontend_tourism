// src/pages/PlaceDetail.tsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Phone, Globe, Star } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePlace } from '../hooks/usePlace';
import { useReviews } from '../hooks/useReviews';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { ImageGallery } from '../components/places/ImageGallery';
import { ReviewSection } from '../components/places/ReviewSection';
import { Map } from '../components/places/Map';
import { NearbyPlaces } from '../components/places/NearbyPlaces';
import { ShareButton } from '../components/places/ShareButton';
import { PhotoGrid } from '../components/places/PhotoGrid';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const PlaceDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // State for image gallery
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  
  // Move all hooks before any conditional logic
  const placeId = id ? parseInt(id) : -1;
  const { data: place, isLoading: isLoadingPlace } = usePlace(placeId);
  const { 
    data: reviewsData, 
    isLoading: isLoadingReviews,
    refetch: refetchReviews 
  } = useReviews(placeId);
  
  usePageTitle(place?.name || 'Loading...');

  // Handle invalid ID after all hooks are called
  if (!id || isNaN(parseInt(id))) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Invalid Place ID</h2>
        <p className="text-gray-600 mt-2">
          The requested place could not be found.
        </p>
        <Button
          onClick={() => navigate('/places')}
          variant="outline"
          className="mt-6"
        >
          Back to Places
        </Button>
      </div>
    );
  }

  const handleFavoriteClick = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to add to favorites');
      navigate('/login');
      return;
    }

    if (!place) return;

    try {
      await toggleFavorite(place);
      toast.success(
        isFavorite(place.id) 
          ? 'Removed from favorites' 
          : 'Added to favorites'
      );
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleReviewAdded = () => {
    refetchReviews();
  };

  if (isLoadingPlace) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-[400px] bg-gray-200 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-32 bg-gray-200 rounded" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-64 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  if (!place) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">Place not found</h2>
        <p className="text-gray-600 mt-2">
          The place you're looking for doesn't exist or has been removed.
        </p>
        <Button
          onClick={() => navigate('/places')}
          variant="outline"
          className="mt-6"
        >
          Back to Places
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Image Gallery */}
      {place.images && place.images.length > 0 && (
        <ImageGallery 
          images={place.images}
          onImageClick={(index) => setSelectedImageIndex(index)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Header Section */}
          <div>
            <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{place.name}</h1>
              <div className="mt-2 flex items-center text-gray-600">
                {/* Google Rating */}
                {typeof place.google_rating === 'number' && (
                  <>
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-1">Google</span>
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 font-medium">{place.google_rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-2">•</span>
                  </>
                )}
                
                {/* Site Rating */}
                {typeof place.site_rating === 'number' && (
                  <>
                    <div className="flex items-center">
                      <span className="text-blue-500 mr-1">Site</span>
                      <Star className="w-5 h-5 text-blue-400 fill-current" />
                      <span className="ml-1 font-medium">{place.site_rating.toFixed(1)}</span>
                    </div>
                    <span className="mx-2">•</span>
                  </>
                )}

                {/* Review Count */}
                <span>{place.reviews_count || 0} reviews</span>
                
                {/* Category */}
                {place.category && (
                  <>
                    <span className="mx-2">•</span>
                    <span>{place.category}</span>
                  </>
                )}
              </div>
            </div>
              <div className="flex items-center gap-4">
                <ShareButton place={place} />
                <Button
                  variant="outline"
                  onClick={handleFavoriteClick}
                  className={isFavorite(place.id) ? 'text-red-600' : ''}
                >
                  <Heart 
                    className={`w-5 h-5 mr-2 ${isFavorite(place.id) ? 'fill-current' : ''}`}
                  />
                  {isFavorite(place.id) ? 'Favorited' : 'Add to Favorites'}
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              {place.address && (
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {place.address}
                </div>
              )}
              {place.phone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <a href={`tel:${place.phone}`} className="hover:text-blue-600">
                    {place.phone}
                  </a>
                </div>
              )}
              {place.website && (
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <a 
                    href={place.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-blue-600"
                  >
                    Visit website
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {place.description && (
            <div>
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-gray-700 whitespace-pre-line">{place.description}</p>
            </div>
          )}

          {/* Photo Grid */}
          {place.images && place.images.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Photos</h2>
              <PhotoGrid
                images={place.images}
                onImageClick={(index) => setSelectedImageIndex(index)}
              />
            </div>
          )}

          {/* Reviews Section */}
          <div>
            <h2 className="text-xl font-semibold mb-6">Reviews</h2>
            <ReviewSection
              placeId={placeId}
              reviews={reviewsData || []}  // Changed from reviewsData?.results
              isLoading={isLoadingReviews}
              onReviewAdded={handleReviewAdded}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <div className="space-y-6 p-4">
              {/* Contact Information */}
              <div>
                <h3 className="font-semibold mb-2">Contact Information</h3>
                <div className="space-y-2 text-sm">
                  {place.phone && (
                    <div>
                      <div className="text-gray-600">Phone</div>
                      <a href={`tel:${place.phone}`} className="text-blue-600 hover:text-blue-700">
                        {place.phone}
                      </a>
                    </div>
                  )}
                  {place.website && (
                    <div>
                      <div className="text-gray-600">Website</div>
                      <a 
                        href={place.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 break-all"
                      >
                        {place.website}
                      </a>
                    </div>
                  )}
                  {place.address && (
                    <div>
                      <div className="text-gray-600">Address</div>
                      <div>{place.address}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Map */}
          {place.latitude && place.longitude && (
            <Map place={place} className="sticky top-8" />
          )}

          {/* Nearby Places */}
          <NearbyPlaces currentPlace={place} />
        </div>
      </div>
    </div>
  );
};
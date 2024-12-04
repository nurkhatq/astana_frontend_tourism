// src/pages/Profile.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Pencil, MapPin, Phone, Mail, Globe, Instagram, Facebook, Twitter, Star } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { apiClient } from '../api/client';
import { useQuery } from '@tanstack/react-query';
import { formatDate } from '../utils/format';
import { Review } from '../types';

interface ProfileFormData {
  first_name: string;
  last_name: string;
  bio: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  country: string | null;
  city: string | null;
  instagram: string | null;
  facebook: string | null;
  twitter: string | null;
}
interface PlaceBasic {
  id: number;
  name: string;
  images: { id: number; image: string; is_primary: boolean; }[];
}
const usePlaceBasic = (placeId: number) => {
  console.log('usePlaceBasic called with ID:', placeId); // Add this
  return useQuery({
    queryKey: ['place-basic', placeId],
    queryFn: async () => {
      try {
        console.log('Fetching place with ID:', placeId); // Add this
        const { data } = await apiClient.get<PlaceBasic>(`/places/${placeId}/`);
        console.log('Place data received:', data); // Add this
        return data;
      } catch (error) {
        console.error('Error fetching place:', error);
        throw error;
      }
    },
    enabled: Boolean(placeId),
    staleTime: 5 * 60 * 1000,
  });
};

export const ProfilePage = () => {
  usePageTitle('My Profile');
  const navigate = useNavigate();
  const { user, updateProfile,isAuthenticated, isLoading, updateAvatar } = useAuth();
  const { favorites } = useFavorites();
  const [activeTab, setActiveTab] = useState<'profile' | 'favorites' | 'reviews'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      bio: user?.bio || '',
      phone_number: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '',
      country: user?.country || '',
      city: user?.city || '',
      instagram: user?.instagram || '',
      facebook: user?.facebook || '',
      twitter: user?.twitter || '',
    },
  });
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-center">
          <div className="h-8 w-32 bg-gray-200 rounded mb-4 mx-auto"></div>
          <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }
  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      await updateAvatar(file); // Use the new updateAvatar method
      toast.success('Profile picture updated successfully');
    } catch (error) {
      toast.error('Failed to update profile picture');
      console.error('Avatar update error:', error);
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const renderProfileContent = () => (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center gap-6">
        <div className="relative">
          <img
            src={user?.avatar || 'https://avatars.mds.yandex.net/i?id=6941e2e18fcce6f94a9aec6ffd1c0aa6_l-8497209-images-thumbs&n=13'}
            alt={user?.username}
            className="w-32 h-32 rounded-full object-cover"
          />
          <label
            className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer"
            htmlFor="avatar-upload"
          >
            <Camera className="w-5 h-5 text-gray-600" />
            <input
              type="file"
              id="avatar-upload"
              className="hidden"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
            />
          </label>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.first_name} {user?.last_name}
          </h1>
          <p className="text-gray-600">@{user?.username}</p>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => setIsEditing(true)}
            >
              <Pencil className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              label="First Name"
              {...register('first_name', { required: 'First name is required' })}
              error={errors.first_name?.message}
            />
            <Input
              label="Last Name"
              {...register('last_name', { required: 'Last name is required' })}
              error={errors.last_name?.message}
            />
            <Input
              label="Bio"
              {...register('bio')}
              error={errors.bio?.message}
            />
            <Input
              label="Phone Number"
              {...register('phone_number')}
              error={errors.phone_number?.message}
            />
            <Input
              type="date"
              label="Date of Birth"
              {...register('date_of_birth')}
              error={errors.date_of_birth?.message}
            />
            <Input
              label="Country"
              {...register('country')}
              error={errors.country?.message}
            />
            <Input
              label="City"
              {...register('city')}
              error={errors.city?.message}
            />
            <Input
              label="Instagram Username"
              {...register('instagram')}
              error={errors.instagram?.message}
            />
            <Input
              label="Facebook Username"
              {...register('facebook')}
              error={errors.facebook?.message}
            />
            <Input
              label="Twitter Username"
              {...register('twitter')}
              error={errors.twitter?.message}
            />
          </div>
          
          <div className="flex gap-4">
            <Button type="submit">Save Changes</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      ) : (
        <Card>
          <div className="space-y-4">
            {user?.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="mt-1 text-gray-900">{user.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user?.phone_number && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  {user.phone_number}
                </div>
              )}
              {user?.email && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
              )}
              {(user?.city || user?.country) && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {[user.city, user.country].filter(Boolean).join(', ')}
                </div>
              )}
            </div>

            {/* Social Links */}
            {(user?.instagram || user?.facebook || user?.twitter) && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Social Media
                </h3>
                <div className="flex gap-4">
                  {user.instagram && (
                    <a
                      href={`https://instagram.com/${user.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-pink-600"
                    >
                      <Instagram className="w-5 h-5" />
                    </a>
                  )}
                  {user.facebook && (
                    <a
                      href={`https://facebook.com/${user.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                  )}
                  {user.twitter && (
                    <a
                      href={`https://twitter.com/${user.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-blue-400"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );

  const renderFavorites = () => {
    // Add debug log
    console.log('Favorites data:', favorites);
  
    // Check if favorites exists and is an array
    if (!favorites || !Array.isArray(favorites)) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">No favorite places yet.</p>
        </div>
      );
    }
  
    // If it's empty array
    if (favorites.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't added any places to favorites yet.</p>
        </div>
      );
    }
  
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((place) => (
          <Card 
            key={place.id}
            className="group cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate(`/places/${place.id}`)}
          >
            <div className="relative h-48">
              <img
                src={place.images?.[0]?.image || '/api/placeholder/400/300'}
                alt={place.name}
                className="w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
              />
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {/* Google Rating */}
                <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
                  <span className="text-gray-500 mr-1">G</span>
                  ⭐️ {place.google_rating ? place.google_rating.toFixed(1) : 'N/A'}
                </div>
                {/* Site Rating */}
                <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
                  <span className="text-blue-500 mr-1">S</span>
                  ⭐️ {place.site_rating ? place.site_rating.toFixed(1) : 'N/A'}
                </div>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                {place.name}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {place.address}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <span>{place.reviews_count || 0} reviews</span>
                <span className="mx-2">•</span>
                <span>{place.category}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  };

  const renderReviews = () => {
    const ReviewCard = ({ review }: { review: Review }) => {
      console.log('Complete review object:', review);
   
      // Use place_id instead of place
      const { data: place, isLoading: isLoadingPlace } = usePlaceBasic(review.place_id);
      
      return (
        <Card className="hover:shadow-md transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 
                  className="font-bold text-lg hover:text-blue-600 cursor-pointer"
                  onClick={() => navigate(`/places/${review.place_id}`)}
                >
                  {isLoadingPlace ? (
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
                  ) : place ? (
                    place.name
                  ) : (
                    'Loading place...'
                  )}
                </h3>
                <div className="text-sm text-gray-500">
                  {formatDate(review.created_at)}
                </div>
              </div>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= review.rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
            {place?.images?.[0]?.image && (
              <div className="mt-4">
                <img
                  src={place.images[0].image}
                  alt={place.name}
                  className="h-32 w-full object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </Card>
      );
    };
   
    if (!user?.recent_reviews?.length) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500">You haven't written any reviews yet.</p>
        </div>
      );
    }
   
    return (
      <div className="space-y-6">
        {user.recent_reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
   };

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="border-b">
        <div className="flex space-x-8">
          {[
            { id: 'profile', label: 'Profile' },
            { id: 'favorites', label: 'Favorites' },
            { id: 'reviews', label: 'Reviews' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`
                py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'profile' && renderProfileContent()}
      {activeTab === 'favorites' && renderFavorites()}
      {activeTab === 'reviews' && renderReviews()}
    </div>
  );
};
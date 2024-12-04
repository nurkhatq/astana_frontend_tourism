import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Star } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { apiClient } from '../api/client';
import { formatDate } from '../utils/format';
import { Review } from '../types';
import { MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import {usePlaceName} from '../hooks/usePlace'
interface ReviewsResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Review[];
  }

interface UserProfileData {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string;
    avatar_url?: string; 
    bio: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    country: string | null;
    city: string | null;
    preferred_language: string;
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
    review_count: number;
    favorite_places_count: number;
    date_joined: string;
  }

const useUserProfile = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const { data } = await apiClient.get<UserProfileData>(`/users/profile/${userId}/`);
      return data;
    },
  });
};

const useUserReviews = (userId: string) => {
    return useQuery({
      queryKey: ['user-reviews', userId],
      queryFn: async () => {
        const { data } = await apiClient.get<ReviewsResponse>(`/users/${userId}/reviews/`);
        return data;
      },
    });
  };

  const ReviewItem = ({ review }: { review: Review }) => {
    const navigate = useNavigate();
    const { data: placeName, isLoading: isLoadingPlace } = usePlaceName(review.place_id);
  
    const renderStars = (rating: number) => {
      return (
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`w-5 h-5 ${
                star <= rating
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              }`}
            />
          ))}
        </div>
      );
    };
  
    return (
      <div className="border-b last:border-b-0 pb-6 last:pb-0">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 
              className="font-medium text-lg text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => navigate(`/places/${review.place_id}`)}
            >
              {isLoadingPlace ? (
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
              ) : (
                placeName
              )}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDate(review.created_at)}
            </p>
          </div>
          {renderStars(review.rating)}
        </div>
        <p className="text-gray-700">{review.comment}</p>
      </div>
    );
  };

  const ReviewsSection = ({ reviews, isLoading }: { 
    reviews: ReviewsResponse | undefined, 
    isLoading: boolean 
  }) => {
    if (isLoading) {
      return <div className="animate-pulse space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-lg" />
        ))}
      </div>;
    }
  
    if (!reviews?.results?.length) {
      return <p className="text-gray-500 text-center py-4">No reviews yet</p>;
    }
  
    return (
      <div className="space-y-6">
        {reviews.results.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    );
  };

export const UserProfilePage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: user, isLoading: isLoadingUser } = useUserProfile(id!);
    const { data: reviews, isLoading: isLoadingReviews } = useUserReviews(id!);
  
    if (isLoadingUser) {
      return <div className="animate-pulse">...</div>;
    }
  
    if (!user) {
      return <div>User not found</div>;
    }
  
    return (
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <Card className="p-6 mb-6">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            {user.avatar_url || user.avatar ? (
              <img
                src={user.avatar_url || user.avatar}
                alt={'https://avatars.mds.yandex.net/i?id=6941e2e18fcce6f94a9aec6ffd1c0aa6_l-8497209-images-thumbs&n=13'}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-4xl font-medium text-blue-600">
                  {user.first_name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            
            {/* User Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {user.first_name} {user.last_name}
              </h1>
              <p className="text-gray-600">@{user.username}</p>
              <div className="mt-2 text-sm text-gray-500">
                {user.city && user.country && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {`${user.city}, ${user.country}`}
                  </div>
                )}
              </div>
              <div className="flex gap-4 mt-2 text-sm text-gray-500">
                <span>{user.review_count} reviews</span>
                <span>{user.favorite_places_count} favorites</span>
              </div>
            </div>
          </div>
        </Card>
  
        {/* About Section */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">About</h2>
          <div className="space-y-4">
            {user.bio && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                <p className="mt-1">{user.bio}</p>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {user.phone_number && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                  <p className="mt-1">{user.phone_number}</p>
                </div>
              )}
              
              {user.email && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1">{user.email}</p>
                </div>
              )}
              
              {user.date_of_birth && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Birth Date</h3>
                  <p className="mt-1">{formatDate(user.date_of_birth)}</p>
                </div>
              )}
            </div>
  
            {/* Social Links */}
            {(user.instagram || user.facebook || user.twitter) && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Social Media</h3>
                <div className="flex gap-4">
                  {user.instagram && (
                    <a href={`https://instagram.com/${user.instagram}`} target="_blank" rel="noopener noreferrer">
                      <Instagram className="w-5 h-5 text-gray-600 hover:text-pink-600" />
                    </a>
                  )}
                  {user.facebook && (
                    <a href={`https://facebook.com/${user.facebook}`} target="_blank" rel="noopener noreferrer">
                      <Facebook className="w-5 h-5 text-gray-600 hover:text-blue-600" />
                    </a>
                  )}
                  {user.twitter && (
                    <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer">
                      <Twitter className="w-5 h-5 text-gray-600 hover:text-blue-400" />
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
  
        {/* Reviews Section */}
        <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">
            Reviews ({user.review_count})
            </h2>
        </div>
        <ReviewsSection 
            reviews={reviews} 
            isLoading={isLoadingReviews} 
        />
        </Card>
      </div>
    );
  };
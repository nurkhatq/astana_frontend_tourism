// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Search } from 'lucide-react';
import { usePlaces } from '../hooks/usePlaces';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Place } from '../types';

const categories = [
  { id: '19', name: 'Restaurants', icon: '🍽️' },
  { id: '8', name: 'Hotels', icon: '🏨' },
  { id: '1', name: 'Attractions', icon: '🎭' },
  { id: '3', name: 'Shopping', icon: '🛍️' },
  { id: '11', name: 'Entertainment', icon: '🎪' },
];

interface SearchFormData {
  search: string;
}

export const HomePage = () => {
  usePageTitle('Discover Astana');
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<SearchFormData>();
  
  const { data: featuredPlaces, isLoading } = usePlaces({ 
    page: 1,
    category: 'all' 
  });

  const onSearch = (data: SearchFormData) => {
    navigate(`/places?search=${encodeURIComponent(data.search)}`);
  };

  const renderPlaceCard = (place: Place) => {
    if (!place) return null;
    console.log('Place data:', place);
    return (
      <Card 
        key={place.id}
        className="group cursor-pointer"
        onClick={() => navigate(`/places/${place.id}`)}
      >
        <div className="relative h-48">
          <img
            src={place.images?.[0]?.image || '/api/placeholder/400/300'}
            alt={place.name}
            className="w-full h-full object-cover rounded-t-lg group-hover:opacity-90 transition-opacity"
          />
          {/* Ratings section */}
          <div className="absolute top-2 right-2 space-y-1">
            {/* Google Rating */}
            <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
              <img 
                src="https://avatars.mds.yandex.net/i?id=c17aa8c62cbb82c6a9e630082f8fe85772e03058-3910933-images-thumbs&n=13" 
                alt="Google" 
                className="w-4 h-4 mr-1"
              />
              ⭐️ {place.google_rating ? place.google_rating.toFixed(1) : 'N/A'}
            </div>
            {/* Site Rating */}
            <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
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
    );
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative h-[500px] -mt-8 mb-8">
        <div className="absolute inset-0">
          <img
            src="https://ztb.kz/storage/media/imperavi/5b0af0c6d6758.jpg"
            alt="Astana Cityscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
        
        <div className="relative max-w-4xl mx-auto pt-32 px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-white text-center mb-6">
            Discover the Beauty of Astana
          </h1>
          <p className="text-xl text-white text-center mb-8">
            Explore the best places to visit, eat, and stay in Kazakhstan's capital
          </p>
          
          <form onSubmit={handleSubmit(onSearch)} className="max-w-2xl mx-auto">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  {...register('search')}
                  placeholder="Search for places, restaurants, hotels..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button type="submit" size="lg">Search</Button>
            </div>
          </form>
        </div>
      </section>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Explore by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => navigate(`/places?category=${category.id}`)}
              className="p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-center group"
            >
              <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="font-medium text-gray-900">{category.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Featured Places Section */}
      <section>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Featured Places
        </h2>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse h-[300px]">
                <div className="h-48 bg-gray-200 rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredPlaces?.results?.map((place) => renderPlaceCard(place))}
          </div>
        )}
      </section>
    </div>
  );
};
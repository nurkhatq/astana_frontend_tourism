// src/pages/Places.tsx
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Star } from 'lucide-react';
import { usePlaces } from '../hooks/usePlaces';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Place } from '../types';

const categories = [
  { id: 'all', name: 'All Places'},
  { id: '1', name: 'Attractions' },
  { id: '3', name: 'Shopping' },
  { id: '8', name: 'Hotels' },
  { id: '11', name: 'Entertainment' },
  { id: '14', name: 'Sports' },
  { id: '19', name: 'Restaurants' },
  { id: '20', name: 'Nature' }
];


export const PlacesPage = () => {
  usePageTitle('Places - Astana Tourism');
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [page, setPage] = useState(1);
  
  const currentCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  const { data, isLoading, isFetching } = usePlaces({
    category: currentCategory === 'all' ? undefined : currentCategory,
    search: searchQuery,
    page,
  });

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    setSearchParams(params => {
      if (search) {
        params.set('search', search);
      } else {
        params.delete('search');
      }
      return params;
    });
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSearchParams(params => {
      if (category === 'all') {
        params.delete('category');
      } else {
        params.set('category', category);
      }
      return params;
    });
    setPage(1);
  };

  const renderPlaceCard = (place: Place) => {
    if (!place) return null;
  
    return (
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
            {typeof place.google_rating === 'number' && (
              <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
                <span className="text-gray-500 mr-1">G</span>
                ⭐️ {place.google_rating.toFixed(1)}
              </div>
            )}
            {typeof place.site_rating === 'number' && (
              <div className="bg-white px-2 py-1 rounded text-sm font-medium flex items-center">
                <span className="text-blue-500 mr-1">S</span>
                ⭐️ {place.site_rating.toFixed(1)}
              </div>
            )}
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
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className={`
        lg:w-64 flex-shrink-0
        ${isFiltersOpen ? 'block' : 'hidden lg:block'}
      `}>
        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
          <h2 className="font-bold text-lg mb-4">Categories</h2>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={`
                  w-full text-left px-4 py-2 rounded-lg transition-colors
                  ${currentCategory === category.id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'hover:bg-gray-50'
                  }
                `}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Search and Filters Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <form onSubmit={handleSearch} className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  name="search"
                  defaultValue={searchQuery}
                  placeholder="Search places..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </form>
            <Button
              variant="outline"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Places Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
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
          <>
            {data?.results && data.results.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.results.map((place) => renderPlaceCard(place))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900">No places found</h3>
                <p className="mt-2 text-gray-500">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}

            {/* Pagination */}
            {data && data.count > 0 && (
              <div className="mt-8 flex justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1 || isFetching}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(p => p + 1)}
                  disabled={!data.next || isFetching}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
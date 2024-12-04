export interface User {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
    bio: string | null;
    phone_number: string | null;
    date_of_birth: string | null;
    country: string | null;
    city: string | null;
    preferred_language: 'en' | 'ru' | 'kk';
    instagram: string | null;
    facebook: string | null;
    twitter: string | null;
    recent_reviews: Review[];
    favorite_places: Place[];
    reviews_count: number;
    favorite_places_count: number;
  }
  
  export interface Place {
    id: number;
    name: string;
    description: string;
    category: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    website: string | null;
    images: PlaceImage[];
    google_rating: number | null;
    site_rating: number | null;
    reviews_count: number;
  }
  
  export interface PlaceImage {
    id: number;
    image: string;
    is_primary: boolean;
  }

  interface ReviewUser {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    avatar: string | null;
  }

  export interface Review {
    id: number;
    user: ReviewUser;
    place:number;
    rating: number;
    comment: string;
    user_name: string;
    created_at: string;
    place_id: number;
  }
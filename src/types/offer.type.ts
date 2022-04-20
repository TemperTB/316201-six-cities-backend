import { City } from './cities.type';
import { User } from './user.type';

export type Offer = {
  bedrooms: number;
  city: City;
  description: string;
  goods: string[];
  host: User;
  id: number;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  location: {
    latitude: number;
    longitude: number;
    zoom: number;
  };
  maxAdults: number;
  previewImage: string;
  price: number;
  rating: number;
  title: string;
  type: string;
  postDate: Date;
  commentsLength: number;
};

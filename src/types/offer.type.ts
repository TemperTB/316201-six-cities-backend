import { City } from './cities.type';
import { OfferType } from './offer-type.enum';
import { User } from './user.type';

export type Offer = {
  bedrooms: number;
  city: City;
  description: string;
  goods: string[];
  user: User;
  id: number;
  images: string[];
  isFavorite: boolean;
  isPremium: boolean;
  locationLtd: number;
  locationLng: number;
  locationZoom: number;
  maxAdults: number;
  previewImage: string;
  price: number;
  rating: number;
  title: string;
  type: OfferType;
  postDate: Date;
  commentCount: number;
};

import CommentDto from '../../dto/comment.dto';
import OfferDto from '../../dto/offer.dto';
import UserDto from '../../dto/user.dto';
import { Offer } from '../../types/offer';
import { Review } from '../../types/review';
import { User } from '../../types/user';

export const adaptUserToClient =
  (user: UserDto): User => ({
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    isPro: user.isPro
  });

export const adaptOffersToClient =
  (offers: OfferDto[]): Offer[] =>
    offers
      .map((offer: OfferDto) => adaptOfferToClient(offer));

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
  bedrooms: offer.bedrooms,
  city: {
    name: offer.city.name,
    location: {
      latitude: offer.city.ltd,
      longitude: offer.city.lng,
    }
  },
  description: offer.description,
  goods: offer.goods,
  host: adaptUserToClient(offer.user),
  id: offer.id,
  images: [
    'http://123.ru/1.jpg',
    'http://123.ru/1.jpg',
    'http://123.ru/1.jpg',
    'http://123.ru/1.jpg',
    'http://123.ru/1.jpg',
    'http://123.ru/1.jpg'],
  isFavorite: offer.isFavorite,
  isPremium: offer.isPremium,
  location: {
    latitude: offer.locationLtd,
    longitude: offer.locationLng,
  },
  maxAdults: offer.maxAdults,
  previewImage: offer.previewImage,
  price: offer.price,
  rating: offer.rating,
  title: offer.title,
  type: offer.type,
});

export const adaptCommentsToClient =
  (comments: CommentDto[]): Review[] =>
    comments
      .map((comment: CommentDto) => adaptCommentToClient(comment));

export const adaptCommentToClient = (comment: CommentDto): Review => ({
  comment: comment.text,
  date: comment.postDate,
  id: comment.id,
  rating: comment.rating,
  user: adaptUserToClient(comment.user),
});

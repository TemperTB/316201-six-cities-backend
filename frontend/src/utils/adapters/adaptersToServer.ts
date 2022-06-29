import CreateCommentDto from '../../dto/create-comment.dto';
import CreateOfferDto from '../../dto/create-offer.dto';
import CreateUserDto from '../../dto/create-user.dto';
import { NewOffer } from '../../types/new-offer';
import { NewReview } from '../../types/new-review';
import { NewUser } from '../../types/new-user';
import { getTime } from '../utils';

export const adaptSignupToServer =
  (user: NewUser): CreateUserDto => ({
    name: user.name,
    email: user.email,
    password: user.password,
    isPro: user.isPro,
  });

export const adaptAvatarToServer =
  (file: File) => {
    const formData = new FormData();
    formData.set('avatar', file);

    return formData;
  };

export const adaptCommentToServer =
  (comment: NewReview): CreateCommentDto => ({
    text: comment.comment,
    rating: comment.rating,
  });

export const adaptOfferToServer =
  (offer: NewOffer): CreateOfferDto => ({
    bedrooms: offer.bedrooms,
    city: offer.city,
    description: offer.description,
    goods: offer.goods,
    isPremium: offer.isPremium,
    locationLtd: offer.location.latitude,
    locationLng: offer.location.longitude,
    locationZoom: 10,
    maxAdults: offer.maxAdults,
    price: offer.price,
    rating: 3,
    title: offer.title,
    type: offer.type,
    postDate: getTime(),
    previewImage: 'http://localhost:3000/static/default-preview-image-1.jpg',
    images: [
      'http://localhost:3000/static/default-preview-image-1.jpg',
      'http://localhost:3000/static/default-preview-image-2.jpg',
      'http://localhost:3000/static/default-preview-image-3.jpg',
      'http://localhost:3000/static/default-preview-image-1.jpg',
      'http://localhost:3000/static/default-preview-image-2.jpg',
      'http://localhost:3000/static/default-preview-image-3.jpg'],
  });

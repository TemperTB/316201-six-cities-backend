import { Offer } from '../types/offer.type.js';
import crypto from 'crypto';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';

/**
 * Разбирает строку импорта из формата TSV
 */
export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [id, title, description, createdDate, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, user, commentCount, locationLtd, locationLng, locationZoom, isFavorite] = tokens;
  const [cityName, cityLtd, cityLng, cityZoom] = city.split(';');
  const [userAvatar, userStatus, userName, userEmail, userPassword] = user.split(';');
  return {
    bedrooms: Number(bedrooms),
    city: {
      name: cityName,
      ltd: Number(cityLtd),
      lng: Number(cityLng),
      zoom: Number(cityZoom),
    },
    description,
    goods: goods.split(';'),
    user: {
      avatarUrl: userAvatar,
      isPro: Boolean(+userStatus),
      name: userName,
      email: userEmail,
      password: userPassword,
    },
    id: Number(id),
    images: images.split(';'),
    isFavorite: Boolean(+isFavorite),
    isPremium: Boolean(+isPremium),
    locationLtd: Number(locationLtd),
    locationLng: Number(locationLng),
    locationZoom: Number(locationZoom),
    maxAdults: Number(maxAdults),
    previewImage,
    price: Number(price),
    rating: Number(rating),
    title,
    type,
    postDate: new Date(createdDate),
    commentCount: Number(commentCount),
  } as Offer;
};

/**
 * Возвращает сообщение об ошибке если это Error
 */
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

/**
   * Вычисляет ХЭШ строки
   */
export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = crypto.createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};

export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export const createErrorObject = (message: string) => ({
  error: message,
});

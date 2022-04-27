import { Offer } from '../types/offer.type.js';

/**
 * Разбирает строку импорта из формата TSV
 */
export const createOffer = (row: string) => {
  const tokens = row.replace('\n', '').split('\t');
  const [id, title, description, createdDate, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, user, commentsLength, location, isFavorite] = tokens;
  const [cityName, cityLtd, cityLng, cityZoom] = city.split(';');
  const [userAvatar, userId, userStatus, userName, userEmail, userPassword] = user.split(';');
  const [lng, ltd, zoom] = location.split(';');
  return {
    bedrooms: Number(bedrooms),
    city: {
      name: cityName,
      location: {
        latitude: Number(cityLtd),
        longitude: Number(cityLng),
        zoom: Number(cityZoom),
      },
    },
    description,
    goods: goods.split(';'),
    host: {
      avatarUrl: userAvatar,
      id: Number(userId),
      isPro: Boolean(userStatus),
      name: userName,
      email: userEmail,
      password: userPassword,
    },
    id: Number(id),
    images: images.split(';'),
    isFavorite: Boolean(isFavorite),
    isPremium: Boolean(isPremium),
    location: {
      latitude: Number(lng),
      longitude: Number(ltd),
      zoom: Number(zoom),
    },
    maxAdults: Number(maxAdults),
    previewImage,
    price: Number(price),
    rating: Number(rating),
    title,
    type,
    postDate: new Date(createdDate),
    commentsLength: Number(commentsLength),
  } as Offer;
};

/**
 * Возвращает сообщение об ошибке если это Error
 */
export const getErrorMessage = (error: unknown): string =>
  error instanceof Error ? error.message : '';

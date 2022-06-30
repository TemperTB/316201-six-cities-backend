import { Offer } from '../types/offer.type.js';
import crypto from 'crypto';
import {plainToInstance} from 'class-transformer';
import {ClassConstructor} from 'class-transformer/types/interfaces/class-constructor.type.js';
import * as jose from 'jose';
import { UnknownObject } from '../types/unknown-object.type.js';
import { DEFAULT_STATIC_IMAGES } from '../app/application.constant.js';
import { ValidationError } from 'class-validator';
import { ValidationErrorField } from '../types/validation-error-field.type.js';
import { ServiceError } from '../types/service-error.enum.js';

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
    postDate: createdDate,
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

export const createErrorObject = (serviceError: ServiceError, message: string, details: ValidationErrorField[] = []) => ({
  errorType: serviceError,
  message,
  details: [...details]
});

export const createJWT = async (algoritm: string, jwtSecret: string, payload: object): Promise<string> =>
  new jose.SignJWT({...payload})
    .setProtectedHeader({ alg: algoritm})
    .setIssuedAt()
    .setExpirationTime('2d')
    .sign(crypto.createSecretKey(jwtSecret, 'utf-8'));

export const getFullServerPath = (host: string, port: number) => `http://${host}:${port}`;

const isObject = (value: unknown) => typeof value === 'object' && value !== null;

export const transformProperty = (
  property: string,
  someObject: UnknownObject,
  transformFn: (object: UnknownObject) => void
) => {
  Object.keys(someObject)
    .forEach((key) => {
      if (key === property) {
        transformFn(someObject);
      } else if (isObject(someObject[key])) {
        transformProperty(property, someObject[key] as UnknownObject, transformFn);
      }
    });
};

export const transformObject = (properties: string[], staticPath: string, uploadPath: string, data:UnknownObject) => {
  properties
    .forEach((property) => transformProperty(property, data, (target: UnknownObject) => {
      const rootPath = DEFAULT_STATIC_IMAGES.includes(target[property] as string) ? staticPath : uploadPath;
      target[property] = `${rootPath}/${target[property]}`;
    }));
};

export const transformErrors = (errors: ValidationError[]): ValidationErrorField[] =>
  errors.map(({property, value, constraints}) => ({
    property,
    value,
    messages: constraints ? Object.values(constraints) : []
  }));

import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { City } from '../../types/cities.type';
import { MockData } from '../../types/mock-data.type';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../utils/utils.js';
import { OfferGeneratorInterface } from './offer-generator.interface';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_ROOM_COUNT = 1;
const MAX_ROOM_COUNT = 8;
const MIN_ADULTS_COUNT = 1;
const MAX_ADULTS_COUNT = 10;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_COMMENTS_LENGTH = 0;
const MAX_COMMENTS_LENGTH = 10;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const id = nanoid();
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<City>(this.mockData.cities);
    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = generateRandomValue(0, 1);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem<string>(this.mockData.types);
    const bedrooms = generateRandomValue(MIN_ROOM_COUNT, MAX_ROOM_COUNT);
    const maxAdults = generateRandomValue(MIN_ADULTS_COUNT, MAX_ADULTS_COUNT);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods);
    const user = {
      name: getRandomItem<string>(this.mockData.names),
      avatarUrl: getRandomItem<string>(this.mockData.avatarUrls),
      id: nanoid(),
      isPro: generateRandomValue(0, 1),
    };
    const commentsLength = generateRandomValue(MIN_COMMENTS_LENGTH, MAX_COMMENTS_LENGTH, 0);
    const location = {
      latitude: generateRandomValue(1, 1 + 0.01, 6),
      longitude: generateRandomValue(1, 1 + 0.01, 6),
      zoom: city.location.zoom,
    };
    const isFavorite = generateRandomValue(0, 1);

    return [
      id, title,
      description, createdDate, Object.values(city).join(';'), previewImage,
      images, isPremium, rating, type, bedrooms, maxAdults,
      price, goods, Object.values(user).join(';'), commentsLength, Object.values(location).join(';'),
      isFavorite,
    ].join('\t');
  }
}

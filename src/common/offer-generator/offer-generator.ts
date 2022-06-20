import dayjs from 'dayjs';
import { customAlphabet } from 'nanoid';
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
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;
const nanoid = customAlphabet('1234567890', 10);
export default class OfferGenerator implements OfferGeneratorInterface {
  constructor(private readonly mockData: MockData) {}

  public generate(): string {
    const id = nanoid();
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const createdDate = dayjs().subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day').toISOString();
    const city = getRandomItem<City>(this.mockData.cities);
    const cityString = `${city.name};${city.ltd};${city.lng};${city.zoom}`;
    const previewImage = getRandomItem<string>(this.mockData.images);
    const images = getRandomItems<string>(this.mockData.images);
    const imagesString = images.join(';');
    const isPremium = generateRandomValue(0, 1);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem<string>(this.mockData.types);
    const bedrooms = generateRandomValue(MIN_ROOM_COUNT, MAX_ROOM_COUNT);
    const maxAdults = generateRandomValue(MIN_ADULTS_COUNT, MAX_ADULTS_COUNT);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems<string>(this.mockData.goods);
    const goodsString = goods.join(';');
    const user = {
      avatarUrl: getRandomItem<string>(this.mockData.avatarUrls),
      isPro: generateRandomValue(0, 1),
      name: getRandomItem<string>(this.mockData.names),
      email: getRandomItem<string>(this.mockData.emails),
      password: getRandomItem<string>(this.mockData.passwords),
    };
    const userString = Object.values(user).join(';');
    const commentCount = 0;
    const locationLtd = generateRandomValue(1, 1 + 0.01, 6);
    const locationLng = generateRandomValue(1, 1 + 0.01, 6);
    const locationZoom = city.zoom;

    return [
      id, title,
      description, createdDate, cityString, previewImage,
      imagesString, isPremium, rating, type, bedrooms, maxAdults,
      price, goodsString, userString, commentCount, locationLtd,
      locationLng, locationZoom,
    ].join('\t');
  }
}

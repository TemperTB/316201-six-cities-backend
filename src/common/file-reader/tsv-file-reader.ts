import { readFileSync } from 'fs';
import { Offer } from '../../types/offer.type.js';
import { FileReaderInterface } from './file-reader.interface.js';

export default class TSVFileReader implements FileReaderInterface {
  private rawData = '';

  constructor(public filename: string) { }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      return [];
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim() !== '')
      .map((line) => line.split('\t'))
      .map(([id, title, description, createdDate, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, user, commentsLength, location, isFavorite]) => ({
        bedrooms: Number(bedrooms),
        city: {
          name: city.split(';')[0],
          location: {
            latitude: Number(city.split(';')[1]),
            longitude: Number(city.split(';')[2]),
            zoom: Number(city.split(';')[3]),
          },
        },
        description,
        goods: goods.split(';'),
        host: {
          avatarUrl: user.split(';')[0],
          id: Number(user.split(';')[1]),
          isPro: Boolean(user.split(';')[2]),
          name: user.split(';')[3],
          email: user.split(';')[4],
          password: user.split(';')[5],
        },
        id: Number(id),
        images: images.split(';'),
        isFavorite: Boolean(isFavorite),
        isPremium: Boolean(isPremium),
        location: {
          latitude: Number(location.split(';')[0]),
          longitude: Number(location.split(';')[1]),
          zoom: Number(location.split(';')[2]),
        },
        maxAdults: Number(maxAdults),
        previewImage,
        price: Number(price),
        rating: Number(rating),
        title,
        type,
        postDate: new Date(createdDate),
        commentsLength: Number(commentsLength),
      }));
  }
}

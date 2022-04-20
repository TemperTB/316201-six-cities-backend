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
      .map(([id, title, description, createdDate, city, previewImage, images, isPremium, rating, type, bedrooms, maxAdults, price, goods, host, commentsLength, location, isFavorite]) => ({
        bedrooms: Number(bedrooms),
        city: {
          name: 'Paris',
          location: {
            latitude: 1,
            longitude: 1,
            zoom: 1,
          },
        },
        description,
        goods: goods.split(';')
          .map((good) => (good)),
        host: {
          avatarUrl: '1',
          id: 1,
          isPro: false,
          name: 'Pavel',
        },
        id: Number(id),
        images: images.split(';')
          .map((image) => (image)),
        isFavorite: Boolean(isFavorite),
        isPremium: Boolean(isPremium),
        location: {
          latitude: 1,
          longitude: 1,
          zoom: 1,
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

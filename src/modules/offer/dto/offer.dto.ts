import {Expose} from 'class-transformer';
import { City } from '../../../types/cities.type.js';
import { OfferType } from '../../../types/offer-type.enum.js';
import { User } from '../../../types/user.type.js';

export default class OfferDto {
  @Expose()
  public bedrooms!: number;

  @Expose()
  public city!: City;

  @Expose()
  public description!: string;

  @Expose()
  public goods!: string[];

  @Expose()
  public user!: User;

  @Expose()
  public images!: string[];

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public locationLtd!: number;

  @Expose()
  public locationLng!: number;

  @Expose()
  public locationZoom!: number;

  @Expose()
  public maxAdults!: number;

  @Expose()
  public previewImage!: string;

  @Expose()
  public price!: number;

  @Expose()
  public rating!: number;

  @Expose()
  public title!: string;

  @Expose()
  public type!: OfferType;

  @Expose()
  public postDate!: Date;

  @Expose()
  public commentCount!: number;
}

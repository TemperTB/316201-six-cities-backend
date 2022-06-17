import {Expose, Type} from 'class-transformer';
import { OfferType } from '../../../types/offer-type.enum.js';
import CityDto from '../../city/dto/city.dto.js';

import UserDto from '../../user/dto/user.dto.js';

export default class OfferDto {
  @Expose()
  public bedrooms!: number;

  @Expose({ name: 'cityId'})
  @Type(() => CityDto)
  public city!: CityDto;

  @Expose()
  public description!: string;

  @Expose()
  public goods!: string[];

  @Expose({ name: 'userId'})
  @Type(() => UserDto)
  public user!: UserDto;

  @Expose()
  public images!: string[];

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

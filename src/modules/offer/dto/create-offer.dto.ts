import {OfferType} from '../../../types/offer-type.enum.js';

export default class CreateOfferDto {
  public bedrooms!: number;
  public cityId!: string;
  public description!: string;
  public goods!: string[];
  public userId!: string;
  public images!: string[];
  public isFavorite!: boolean;
  public isPremium!: boolean;
  public locationLtd!: number;
  public locationLng!: number;
  public locationZoom!: number;
  public maxAdults!: number;
  public previewImage!: string;
  public price!: number;
  public rating!: number;
  public title!: string;
  public type!: OfferType;
  public postDate!: Date;
  public commentCount!: number;
}


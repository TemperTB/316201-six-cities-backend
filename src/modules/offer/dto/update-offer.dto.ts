import {OfferType} from '../../../types/offer-type.enum.js';

export default class UpdateOfferDto {
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public type?: OfferType;
  public price?: number;
  public bedrooms?: number;
  public goods?: string[];
  public images?: string[];
  public isFavorite?: boolean;
  public isPremium?: boolean;
  public locationLtd?: number;
  public locationLng?: number;
  public locationZoom?: number;
  public maxAdults?: number;
  public previewImage?: string;
  public rating?: number;
  public commentCount?: number;
}

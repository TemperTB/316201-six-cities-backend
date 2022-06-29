import { City } from '../types/city';


export default class CreateOfferDto {
  public bedrooms!: number;
  public city!: City;
  public description!: string;
  public goods!: string[];
  public isPremium!: boolean;
  public locationLtd!: number;
  public locationLng!: number;
  public locationZoom!: number;
  public maxAdults!: number;
  public price!: number;
  public rating!: number;
  public title!: string;
  public type!: string;
  public postDate!: string;
  public previewImage!: string;
}


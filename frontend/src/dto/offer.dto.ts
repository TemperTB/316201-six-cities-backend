import CityDto from './city.dto';
import UserDto from './user.dto.js';


export default class OfferDto {
  public id!: string;
  public bedrooms!: number;
  public city!: CityDto;
  public description!: string;
  public goods!: string[];
  public user!: UserDto;
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
  public type!: string;
  public postDate!: Date;
  public commentCount!: number;
}

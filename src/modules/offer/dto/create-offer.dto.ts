import {OfferType} from '../../../types/offer-type.enum.js';
import {ArrayMinSize, ArrayMaxSize, IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsLatitude, IsLongitude, IsMongoId, IsString, Max, MaxLength, Min, MinLength} from 'class-validator';


export default class CreateOfferDto {
  @IsInt({message: 'Bedrooms must be an integer'})
  @Min(1, {message: 'Minimum bedrooms is 1'})
  @Max(8, {message: 'Maximum bedrooms is 8'})
  public bedrooms!: number;

  @IsMongoId({message: 'cityId field must be valid an identificator'})
  public cityId!: string;

  @IsString({message: 'description is required'})
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description!: string;

  @IsArray({message: 'Field goods must be an array'})
  public goods!: string[];

  public userId!: string;

  @IsArray({message: 'Field images must be an array'})
  @ArrayMinSize(6, {message: 'Images length must be 6'})
  @ArrayMaxSize(6, {message: 'Images length must be 6'})
  public images!: string[];

  @IsBoolean({message: 'Field isFavorite must be boolean'})
  public isPremium!: boolean;

  @IsLatitude({message: 'LocationLtd must be an integer'})
  public locationLtd!: number;

  @IsLongitude({message: 'locationLng must be an integer'})
  public locationLng!: number;

  @IsInt({message: 'locationZoom must be an integer'})
  public locationZoom!: number;

  @IsInt({message: 'MaxAdults must be an integer'})
  @Min(1, {message: 'Minimum maxAdults is 1'})
  @Max(10, {message: 'Maximum maxAdults is 10'})
  public maxAdults!: number;

  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price!: number;

  @IsInt({message: 'Rating must be a number'})
  @Min(1, {message: 'Minimum rating is 1'})
  @Max(5, {message: 'Maximum rating is 8'})
  public rating!: number;

  @IsString({message: 'title is required'})
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title!: string;

  @IsEnum(OfferType, {message: 'type must be from: apartment, house, room, hotel'})
  public type!: OfferType;

  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate!: Date;

  public commentCount!: number;
}


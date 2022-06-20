import {ArrayMinSize, ArrayMaxSize, IsArray, IsBoolean, IsDateString, IsEnum, IsInt, IsOptional, Max, MaxLength, Min, MinLength} from 'class-validator';
import {OfferType} from '../../../types/offer-type.enum.js';

export default class UpdateOfferDto {
  @IsOptional()
  @MinLength(10, {message: 'Minimum title length must be 10'})
  @MaxLength(100, {message: 'Maximum title length must be 100'})
  public title?: string;

  @IsOptional()
  @MinLength(20, {message: 'Minimum description length must be 20'})
  @MaxLength(1024, {message: 'Maximum description length must be 1024'})
  public description?: string;

  @IsOptional()
  @IsDateString({}, {message: 'postDate must be valid ISO date'})
  public postDate?: Date;

  @IsOptional()
  @IsEnum(OfferType, {message: 'type must be from: apartment, house, room, hotel'})
  public type?: OfferType;

  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public price?: number;

  @IsOptional()
  @IsInt({message: 'Price must be an integer'})
  @Min(100, {message: 'Minimum price is 100'})
  @Max(100000, {message: 'Maximum price is 100000'})
  public bedrooms?: number;

  @IsOptional()
  @IsArray({message: 'Field goods must be an array'})
  public goods?: string[];

  @IsOptional()
  @IsArray({message: 'Field images must be an array'})
  @ArrayMinSize(6, {message: 'Images length must be 6'})
  @ArrayMaxSize(6, {message: 'Images length must be 6'})
  public images?: string[];


  @IsOptional()
  @IsBoolean({message: 'Field isFavorite must be boolean'})
  public isPremium?: boolean;

  @IsOptional()
  public locationLtd?: number;

  @IsOptional()
  @IsInt({message: 'locationLng must be an integer'})
  public locationLng?: number;

  @IsOptional()
  @IsInt({message: 'locationZoom must be an integer'})
  public locationZoom?: number;

  @IsOptional()
  @IsInt({message: 'MaxAdults must be an integer'})
  @Min(1, {message: 'Minimum maxAdults is 1'})
  @Max(10, {message: 'Maximum maxAdults is 10'})
  public maxAdults?: number;

  @IsOptional()
  @MaxLength(256, {message: 'Too short for field «image»'})
  public previewImage?: string;

  @IsOptional()
  @IsInt({message: 'Rating must be an integer'})
  @Min(1, {message: 'Minimum price is 100'})
  @Max(5, {message: 'Maximum price is 200000'})
  public rating?: number;

}

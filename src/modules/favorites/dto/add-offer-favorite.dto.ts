import {IsMongoId} from 'class-validator';

export default class AddOfferFavoriteDto {

  @IsMongoId({message: 'offerId field must be a valid id'})
  public offerId!: string;

  public userId!: string;

}

import {Expose, Type} from 'class-transformer';
import OfferDto from '../../offer/dto/offer.dto.js';
import UserDto from '../../user/dto/user.dto.js';

export default class FavoriteOfferDto {


  @Expose({ name: 'userId'})
  @Type(() => UserDto)
  public user!: UserDto;

  @Expose({ name: 'offerId'})
  @Type(() => OfferDto)
  public offer!: OfferDto;

}

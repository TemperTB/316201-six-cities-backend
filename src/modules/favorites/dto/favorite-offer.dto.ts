import {Expose, Type} from 'class-transformer';
import OfferDto from '../../offer/dto/offer.dto.js';

export default class FavoriteOfferDto {


  @Expose({ name: 'offerId'})
  @Type(() => OfferDto)
  public offer!: OfferDto;

}

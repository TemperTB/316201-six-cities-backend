
import typegoose, {getModelForClass, Ref, defaultClasses} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import {OfferEntity} from '../offer/offer.entity.js';

const {prop, modelOptions} = typegoose;

export interface FavoriteEntity extends  defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'favorite'
  }
})
export class FavoriteEntity extends defaultClasses.TimeStamps {

  @prop({
    ref: OfferEntity,
    required: true
  })
  public offerId!: Ref<OfferEntity>;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;
}

export const FavoriteModel = getModelForClass(FavoriteEntity);

import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import typegoose, {getModelForClass, Ref} from '@typegoose/typegoose';
import {OfferType} from '../../types/offer-type.enum.js';
import {UserEntity} from '../user/user.entity.js';

const {prop, modelOptions} = typegoose;

@modelOptions({
  schemaOptions: {
    collection: 'offers'
  }
})
export class OfferEntity extends TimeStamps {
  @prop({required: true})
  public bedrooms!: number;

  @prop({trim: true})
  public description!: string;

  @prop()
  public goods!: string[];

  @prop({required: true, unique: true})
  public id!: number;

  @prop()
  public images!: string[];

  @prop({required: true})
  public isFavorite!: boolean;

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public locationLtd!: number;

  @prop({required: true})
  public locationLng!: number;

  @prop({required: true})
  public locationZoom!: number;

  @prop({required: true})
  public maxAdults!: number;

  @prop({required: true, default: 'apartment-01.jpg'})
  public previewImage!: string;

  @prop({required: true})
  public price!: number;

  @prop({required: true})
  public rating!: number;

  @prop({trim: true, required: true})
  public title!: string;

  @prop({required: true})
  public postDate!: Date;

  @prop({
    type: () => String,
    enum: OfferType
  })
  public type!: OfferType;

  @prop({default: 0})
  public commentCount!: number;

  //TODO City
  // @prop({
  //   ref: CategoryEntity,
  //   required: true,
  //   default: [],
  //   _id: false
  // })
  // public categories!: Ref<CategoryEntity>[];

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;
}

export const OfferModel = getModelForClass(OfferEntity);

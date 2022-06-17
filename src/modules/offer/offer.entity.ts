/* eslint-disable @typescript-eslint/no-unused-vars */
import {Base, TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import typegoose, {getModelForClass, Ref} from '@typegoose/typegoose';
import {UserEntity} from '../user/user.entity.js';
import { CityEntity } from '../city/city.entity.js';

const {prop, modelOptions} = typegoose;

export interface OfferEntity extends Base {}

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

  @prop()
  public images!: string[];

  @prop({required: true})
  public isPremium!: boolean;

  @prop({required: true})
  public locationLtd!: number;

  @prop({required: true})
  public locationLng!: number;

  @prop({required: true, default: 10})
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

  @prop({required: true})
  public type!: string;
  // @prop({
  //   type: () => String,
  //   enum: OfferType
  // })
  // public type!: OfferType; //TODO разобраться с вывыбором из enum

  @prop({default: 0})
  public commentCount!: number;

  @prop({
    ref: UserEntity,
    required: true,
  })
  public userId!: Ref<UserEntity>;

  @prop({
    ref: CityEntity,
    required: true,
  })
  public cityId!: Ref<CityEntity>;

}

export const OfferModel = getModelForClass(OfferEntity);

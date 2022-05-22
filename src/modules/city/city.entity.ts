import typegoose, {getModelForClass} from '@typegoose/typegoose';
import {Base, TimeStamps} from '@typegoose/typegoose/lib/defaultClasses.js';
import { City } from '../../types/cities.type';

const {prop, modelOptions} = typegoose;

export interface CityEntity extends Base {}

@modelOptions({
  schemaOptions: {
    collection: 'cities'
  }
})

export class CityEntity extends TimeStamps implements City {

  constructor(data: City) {
    super();
    this.name = data.name;
    this.ltd = data.ltd;
    this.lng = data.lng;
    this.zoom = data.zoom;
  }

  @prop({ unique: true, required: true })
  public name!: string;

  @prop({required: true})
  public ltd!: number;

  @prop({required: true})
  public lng!: number;

  @prop({required: true, default: 10})
  public zoom!: number;

}

export const CityModel = getModelForClass(CityEntity);

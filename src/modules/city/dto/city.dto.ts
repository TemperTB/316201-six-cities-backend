import {Expose} from 'class-transformer';

export default class CityDto {
  @Expose()
  public id!: string;

  @Expose()
  public name!: string ;

  @Expose()
  public ltd!: number;

  @Expose()
  public lng!: number;

  @Expose()
  public zoom!: number;
}

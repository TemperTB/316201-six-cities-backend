import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import { CityEntity } from './city.entity';
import CreateCityDto from './dto/create-city.dto';

export interface CityServiceInterface {
  create(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
  findByName(name: string): Promise<DocumentType<CityEntity> | null>;
  findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>>;
}

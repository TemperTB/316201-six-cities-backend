import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import { CityEntity } from './city.entity.js';
import CreateCityDto from './dto/create-city.dto.js';
import { CityServiceInterface } from './city-service.interface.js';

@injectable()
export default class CityService implements CityServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.CityModel) private readonly cityModel: ModelType<CityEntity>
  ) {}

  public async create(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {

    const city = new CityEntity(dto);

    const result = await this.cityModel.create(city);
    this.logger.info(`New city created: ${city.name}`);

    return result;
  }

  public async findByName(name: string): Promise<DocumentType<CityEntity> | null> {
    return this.cityModel.findOne({name});
  }

  public async findOrCreate(dto: CreateCityDto): Promise<DocumentType<CityEntity>> {
    const existedCity = await this.findByName(dto.name);

    if (existedCity) {
      return existedCity;
    }

    return this.create(dto);
  }
}

import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {Component} from '../../types/component.types.js';
import { OfferEntity } from './offer.entity.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import { OfferServiceInterface } from './offer-service.interface.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.OfferModel) private readonly offerModel: ModelType<OfferEntity>
  ) {}

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {

    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${dto.title}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(id).exec();
  }

  public async find(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find();
  }


}

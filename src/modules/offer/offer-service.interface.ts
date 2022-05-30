import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import CreateOfferDto from './dto/create-offer.dto';
import { OfferEntity } from './offer.entity';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(): Promise<DocumentType<OfferEntity>[]>;
}

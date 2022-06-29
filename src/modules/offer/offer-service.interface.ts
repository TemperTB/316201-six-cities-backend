import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import NewOfferDto from './dto/new-offer.dto';
import UpdateOfferDto from './dto/update-offer.dto';
import { OfferEntity } from './offer.entity';
import {DocumentExistsInterface} from '../../types/document-exists.interface.js';
import { CheckOwnerInterface } from '../../types/my-offer.interface';

export interface OfferServiceInterface extends DocumentExistsInterface, CheckOwnerInterface {
  create(dto: NewOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(id: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  findPremium(count?: number): Promise<DocumentType<OfferEntity>[]>;
  findFavorite(): Promise<DocumentType<OfferEntity>[]>;
  exists(offerId: string): Promise<boolean>;
  incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}

import {DocumentType} from '@typegoose/typegoose/lib/types.js';
import AddOfferFavoriteDto from './dto/add-offer-favorite.dto.js';
import {FavoriteEntity} from './favorite.entity.js';

export interface FavoriteServiceInterface {
  add(dto: AddOfferFavoriteDto): Promise<DocumentType<FavoriteEntity>>;
  findByOfferId(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null>;
  findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]>;
  deleteByOfferId(offerId: string): Promise<DocumentType<FavoriteEntity> | null>;
}

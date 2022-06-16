import {inject, injectable} from 'inversify';
import {DocumentType, ModelType} from '@typegoose/typegoose/lib/types.js';
import {FavoriteServiceInterface} from './favorite-service.interface.js';
import {Component} from '../../types/component.types.js';
import {FavoriteEntity} from './favorite.entity.js';
import AddOfferFavoriteDto from './dto/add-offer-favorite.dto.js';

@injectable()
export default class FavoriteService implements FavoriteServiceInterface {
  constructor(
    @inject(Component.FavoriteModel) private readonly favoriteModel: ModelType<FavoriteEntity>
  ) {}

  public async add(dto: AddOfferFavoriteDto): Promise<DocumentType<FavoriteEntity>> {
    console.log(dto);
    const favorite = await this.favoriteModel.create(dto);
    return favorite.populate('userId');
  }

  public async findByOfferId(offerId: string, userId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel.findOne({offerId, userId});
  }

  public async findByUserId(userId: string): Promise<DocumentType<FavoriteEntity>[]> {
    return this.favoriteModel
      .find({userId});
  }

  public async deleteByOfferId(offerId: string): Promise<DocumentType<FavoriteEntity> | null> {
    return this.favoriteModel
      .findOneAndDelete({offerId})
      .exec();
  }
}

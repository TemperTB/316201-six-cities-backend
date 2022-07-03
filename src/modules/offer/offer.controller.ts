import 'reflect-metadata';
import {Request, Response} from 'express';
import {inject, injectable} from 'inversify';
import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import {OfferServiceInterface} from './offer-service.interface.js';
import {StatusCodes} from 'http-status-codes';
import OfferDto from './dto/offer.dto.js';
import {fillDTO} from '../../utils/common.js';
import CreateOfferDto from './dto/create-offer.dto.js';
import HttpError from '../../common/errors/http-error.js';
import * as core from 'express-serve-static-core';
import { ValidateObjectIdMiddleware } from '../../common/middlewares/validate-objectid.middleware.js';
import UpdateOfferDto from './dto/update-offer.dto.js';
import {RequestQuery} from '../../types/request-query.type.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {CommentServiceInterface} from '../comment/comment-service.interface.js';
import CommentDto from '../comment/dto/comment.dto.js';
import {DocumentExistsMiddleware} from '../../common/middlewares/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import { FavoriteServiceInterface } from '../favorites/favorite-service.interface.js';
import FavoriteOfferDto from '../favorites/dto/favorite-offer.dto.js';
import { ConfigInterface } from '../../common/config/config.interface.js';
import { UploadFileMiddleware } from '../../common/middlewares/upload-file.middleware.js';
import UploadImageDto from './dto/upload-image.dto.js';
import { CheckOwnerMiddleware } from '../../common/middlewares/check-owner.middleware.js';
import { CityServiceInterface } from '../city/city-service.interface.js';
import CityDto from '../city/dto/city.dto.js';

type ParamsGetOffer = {
  offerId: string;
}

type ParamsChangeStatus = {
  offerId: string;
  status: number;
  userId: string;
}

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
  @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  @inject(Component.CityServiceInterface) private readonly cityService: CityServiceInterface,
  @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
  @inject(Component.ConfigInterface) configService: ConfigInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({
      path: '/premium',
      method: HttpMethod.Get,
      handler: this.getPremiumOffers,
    });
    this.addRoute({
      path: '/favorite',
      method: HttpMethod.Get,
      handler: this.getFavoriteOffers,
      middlewares: [
        new PrivateRouteMiddleware()
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.get,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto),
      ]});
    this.addRoute({
      path: '/:offerId/image',
      method: HttpMethod.Post,
      handler: this.uploadImage,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new CheckOwnerMiddleware(this.offerService, 'offerId'),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'image'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckOwnerMiddleware(this.offerService, 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new CheckOwnerMiddleware(this.offerService, 'offerId')
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Patch,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
        new ValidateObjectIdMiddleware('offerId'),
      ]});
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });


  }

  public async index(req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const {limit} = req.query;
    let userId;
    if (!req.user) {
      userId = '00000000000000000000000a';
    } else {
      userId = req.user.id;
    }
    const offers = await this.offerService.find(limit);
    const offersForResult: any = fillDTO(OfferDto, offers);
    let finalOffers: any = [];
    for (const offer of offersForResult) {
      const favoriteFlag = await this.favoriteService.findByOfferId(offer.id, userId);
      if (favoriteFlag) {
        finalOffers = [...finalOffers, {...offer, isFavorite: true}];
      } else {
        finalOffers = [...finalOffers, {...offer, isFavorite: false}];
      }
    }
    this.ok(res, finalOffers);
  }

  public async create(
    req: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {

    const {body, user} = req;
    const city = await this.cityService.findOrCreate(body.city);
    const cityDto = fillDTO(CityDto, city);
    const result = await this.offerService.create({...body, userId: user.id, cityId: cityDto.id});
    const offer = await this.offerService.findById(result.id);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferDto, offer)
    );
  }

  public async get(
    req: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = req.params;
    let userId;
    if (!req.user) {
      userId = '00000000000000000000000a';
    } else {
      userId = req.user.id;
    }
    const offer = await this.offerService.findById(offerId);
    const offerForResult = fillDTO(OfferDto, offer);
    const favoriteFlag = await this.favoriteService.findByOfferId(offerId, userId);
    if (favoriteFlag) {
      const result = {...offerForResult, isFavorite: true};
      this.ok(res, result);
    } else {
      const result = {...offerForResult, isFavorite: false};
      this.ok(res, result);
    }
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const offerId = req.params.offerId;
    const userId = req.user.id;
    const body = req.body;
    const updatedOffer = await this.offerService.updateById(offerId, body);
    const updatedOfferForResult = fillDTO(OfferDto, updatedOffer);
    const favoriteFlag = await this.favoriteService.findByOfferId(offerId, userId);
    if (favoriteFlag) {
      const result = {...updatedOfferForResult, isFavorite: true};
      this.ok(res, result);
    } else {
      const result = {...updatedOfferForResult, isFavorite: false};
      this.ok(res, result);
    }
  }

  public async getPremiumOffers(
    req: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const {limit} = req.query;
    let userId;
    if (!req.user) {
      userId = '00000000000000000000000a';
    } else {
      userId = req.user.id;
    }
    const offers = await this.offerService.findPremium(limit);
    const offersForResult: any = fillDTO(OfferDto, offers);
    let finalOffers: any = [];
    for (const offer of offersForResult) {
      const favoriteFlag = await this.favoriteService.findByOfferId(offer.id, userId);
      if (favoriteFlag) {
        finalOffers = [...finalOffers, {...offer, isFavorite: true}];
      } else {
        finalOffers = [...finalOffers, {...offer, isFavorite: false}];
      }
    }
    this.ok(res, finalOffers);
  }

  public async getFavoriteOffers(
    req: Request,
    res: Response
  ):Promise<void> {
    const offers = await this.favoriteService.findByUserId(req.user.id);
    const offersAfterFillDTO: any = fillDTO(FavoriteOfferDto, offers);
    const result = offersAfterFillDTO.map((item: FavoriteOfferDto) => ({...item.offer, isFavorite: true}));
    if (result.length === 0) {
      this.ok(res, {message: 'No favorite offers'});
    } else {
      this.ok(res, result);
    }

  }

  public async changeFavoriteStatus(
    req: Request<core.ParamsDictionary | ParamsChangeStatus>,
    res: Response
  ): Promise<void> {
    const {params} = req;
    const {offerId, status} = params;
    const userId = req.user.id;
    const favorite = await this.favoriteService.findByOfferId(offerId, userId);
    switch (+status) {
      case 1: {
        if (favorite) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            `User with id ${userId} already has favorite offer with id ${offerId}.`,
            'OfferController'
          );
        }
        const dataFromMongo = await this.favoriteService.add({offerId, userId});
        const viewForResult = fillDTO(FavoriteOfferDto, dataFromMongo);
        const result = {...viewForResult.offer, isFavorite: true};
        this.ok(res, result);
        break;
      }
      case 0: {
        if (!favorite) {
          throw new HttpError(
            StatusCodes.CONFLICT,
            `User with id ${userId} has not favorite offer with id ${offerId}.`,
            'OfferController'
          );
        }
        const dataFromMongo = await this.favoriteService.deleteByOfferId(offerId, userId);
        const viewForResult = fillDTO(FavoriteOfferDto, dataFromMongo);
        const result = {...viewForResult.offer, isFavorite: false};
        this.ok(res, result);
        break;
      }
      default:
        break;
    }
  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentDto, comments));
  }

  public async uploadImage(req: Request<core.ParamsDictionary | ParamsGetOffer>, res: Response) {
    const {offerId} = req.params;
    const updateDto = { previewImage: req.file?.filename };
    await this.offerService.updateById(offerId, updateDto);
    this.created(res, fillDTO(UploadImageDto, updateDto));
  }
}

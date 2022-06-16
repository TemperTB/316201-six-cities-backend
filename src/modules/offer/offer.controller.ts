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
import FavoriteDto from '../favorites/dto/favorite-offer.dto.js';
// import { throws } from 'assert';

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
  @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
  @inject(Component.FavoriteServiceInterface) private readonly favoriteService: FavoriteServiceInterface,
  ) {
    super(logger);

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
      middlewares: [new ValidateDtoMiddleware(CreateOfferDto)]});
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/favorite/:offerId/:status',
      method: HttpMethod.Patch,
      handler: this.changeFavoriteStatus,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new PrivateRouteMiddleware()
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

  public async index({query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>, res: Response): Promise<void> {
    const offers = await this.offerService.find(query.limit);
    const offersDTO = fillDTO(OfferDto, offers);
    this.send(res, StatusCodes.OK, offersDTO);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {

    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferDto, offer)
    );
  }

  public async get(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferDto, offer));
  }

  public async delete(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer>,
    res: Response
  ): Promise<void> {
    const {offerId} = params;
    const offer = await this.offerService.deleteById(offerId);

    this.noContent(res, offer);
  }

  public async update(
    {body, params}: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);

    this.ok(res, fillDTO(OfferDto, updatedOffer));
  }

  public async getPremiumOffers(
    {query}: Request<core.ParamsDictionary, unknown, unknown, RequestQuery>,
    res: Response
  ):Promise<void> {
    const offers = await this.offerService.findPremium(query.limit);
    this.ok(res, fillDTO(OfferDto, offers));
  }

  public async getFavoriteOffers(
    _req: Request,
    res: Response
  ):Promise<void> {
    const offers = await this.offerService.findFavorite();
    this.ok(res, fillDTO(OfferDto, offers));
  }

  public async changeFavoriteStatus(
    req: Request<core.ParamsDictionary | ParamsChangeStatus>,
    res: Response
  ): Promise<void> {
    const {params} = req;
    const {offerId, status} = params;
    if (+status === 1) {
      const favorite = await this.favoriteService.findByOfferId(offerId, req.user.id);
      if (favorite) {
        throw new HttpError(
          StatusCodes.CONFLICT,
          `User with id ${req.user.id} already has favorite offer with id ${offerId}.`,
          'OfferController'
        );
      }

      const result = await this.favoriteService.add({offerId, userId : req.user.id});
      this.ok(res, fillDTO(FavoriteDto, result));
      // const favorite = await this.favoriteService.findByOfferId(offerId, userId);
      // let updatedOffer;
      // if (+status === 1) {
      //   updatedOffer = await this.offerService.add(params.offerId, {isFavorite: true});
      // } else {
      //   updatedOffer = await this.offerService.updateById(params.offerId, {isFavorite: false});
      // }

    // if (favorite) {
    //   throw new HttpError(
    //     StatusCodes.NOT_FOUND,
    //     `Offer with id ${offerId} not found.`,
    //     'OfferController'
    //   );
    }

  }

  public async getComments(
    {params}: Request<core.ParamsDictionary | ParamsGetOffer, object, object>,
    res: Response
  ): Promise<void> {

    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentDto, comments));
  }
}

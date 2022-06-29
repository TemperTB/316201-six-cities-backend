import {Controller} from '../../common/controller/controller.js';
import {Component} from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import {inject} from 'inversify';
import {CommentServiceInterface} from './comment-service.interface.js';
import {Request, Response} from 'express';
import CreateCommentDto from './dto/create-comment.dto.js';
import {OfferServiceInterface} from '../offer/offer-service.interface.js';
import HttpError from '../../common/errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import {HttpMethod} from '../../types/http-method.enum.js';
import {ValidateDtoMiddleware} from '../../common/middlewares/validate-dto.middleware.js';
import {fillDTO} from '../../utils/common.js';
import CommentDto from './dto/comment.dto.js';
import {ConfigInterface} from '../../common/config/config.interface.js';
import { PrivateRouteMiddleware } from '../../common/middlewares/private-route.middleware.js';
import * as core from 'express-serve-static-core';

type ParamsGetOffer = {
  offerId: string;
}

export default class CommentController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.CommentServiceInterface) private readonly commentService: CommentServiceInterface,
    @inject(Component.OfferServiceInterface) private  readonly offerService: OfferServiceInterface,
    @inject(Component.ConfigInterface) configService: ConfigInterface,
  ) {
    super(logger, configService);

    this.logger.info('Register routes for CommentController…');
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDtoMiddleware(CreateCommentDto),
        new PrivateRouteMiddleware(),
      ]
    });
  }

  public async create(
    req: Request<core.ParamsDictionary | ParamsGetOffer, Record<string, unknown>, CreateCommentDto>,
    res: Response
  ): Promise<void> {
    const {offerId} = req.params;
    const {body} = req;
    if (!await this.offerService.exists(offerId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'CommentController'
      );
    }
    const comment = await this.commentService.create({...body, userId: req.user.id, offerId: offerId});
    await this.offerService.incCommentCount(offerId);
    this.created(res, fillDTO(CommentDto, comment));
  }
}


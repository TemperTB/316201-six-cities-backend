import 'reflect-metadata';
//import {plainToInstance} from 'class-transformer';
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

@injectable()
export default class OfferController extends Controller {
  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface,
  @inject(Component.OfferServiceInterface) private readonly offerService: OfferServiceInterface,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({path: '/', method: HttpMethod.Post, handler: this.create});
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.find();
    const offersDTO = fillDTO(OfferDto, offers);
    this.send(res, StatusCodes.OK, offersDTO);
  }

  public async create(
    {body}: Request<Record<string, unknown>, Record<string, unknown>, CreateOfferDto>,
    res: Response): Promise<void> {

    const offer = await this.offerService.create(body);
    const existOffer = await this.offerService.findById(offer.id);

    if (existOffer) {
      const errorMessage = `Category with id «${offer.id}» exists.`;
      this.send(res, StatusCodes.UNPROCESSABLE_ENTITY, {error: errorMessage});
      return this.logger.error(errorMessage);
    }

    this.send(
      res,
      StatusCodes.CREATED,
      fillDTO(OfferDto, offer)
    );
  }
}
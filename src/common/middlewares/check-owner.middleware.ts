import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {NextFunction, Request, Response} from 'express';
import HttpError from '../errors/http-error.js';
import {StatusCodes} from 'http-status-codes';
import { CheckOwnerInterface } from '../../types/my-offer.interface.js';

export class CheckOwnerMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: CheckOwnerInterface,
    private readonly param: string,
  ) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {user} = req;
    const documentId = req.params[this.param];
    if (!await this.service.isOwner(user.id, documentId)) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        'Вы не владелец',
        'CheckOwnerMiddleware'
      );
    }

    next();
  }
}

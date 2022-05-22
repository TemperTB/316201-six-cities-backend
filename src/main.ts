import {Container} from 'inversify';
import {LoggerInterface} from './common/logger/logger.interface.js';
import LoggerService from './common/logger/logger.service.js';
import {Component} from './types/component.types.js';
import {ConfigInterface} from './common/config/config.interface.js';
import ConfigService from './common/config/config.service.js';
import Application from './app/application.js';
import { DatabaseInterface } from './common/database-client/database.interface.js';
import DatabaseService from './common/database-client/database.service.js';
import UserService from './modules/user/user.service.js';
import {UserServiceInterface} from './modules/user/user-service.interface.js';
import {UserEntity, UserModel} from './modules/user/user.entity.js';
import { ModelType } from '@typegoose/typegoose/lib/types.js';
import CityService from './modules/city/city.service.js';
import { CityEntity, CityModel } from './modules/city/city.entity.js';
import { CityServiceInterface } from './modules/city/city-service.interface.js';
import { OfferEntity, OfferModel } from './modules/offer/offer.entity.js';
import { OfferServiceInterface } from './modules/offer/offer-service.interface.js';
import OfferService from './modules/offer/offer.service.js';

const applicationContainer = new Container();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseService).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService);
applicationContainer.bind<ModelType<UserEntity>>(Component.UserModel).toConstantValue(UserModel);
applicationContainer.bind<CityServiceInterface>(Component.CityServiceInterface).to(CityService);
applicationContainer.bind<ModelType<CityEntity>>(Component.CityModel).toConstantValue(CityModel);
applicationContainer.bind<OfferServiceInterface>(Component.OfferServiceInterface).to(OfferService);
applicationContainer.bind<ModelType<OfferEntity>>(Component.OfferModel).toConstantValue(OfferModel);

const application = applicationContainer.get<Application>(Component.Application);
await application.init();


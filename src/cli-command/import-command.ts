import chalk from 'chalk';
import { CliCommandInterface } from './cli-command.interface.js';
import ConsoleLoggerService from '../common/logger/console-logger.service.js';
import TSVFileReader from '../common/file-reader/tsv-file-reader.js';
import {createOffer, getErrorMessage} from '../utils/common.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { DatabaseInterface } from '../common/database-client/database.interface.js';
import { LoggerInterface } from '../common/logger/logger.interface.js';
import { Offer } from '../types/offer.type.js';
import { getURI } from '../utils/db.js';
import UserService from '../modules/user/user.service.js';
import { UserModel } from '../modules/user/user.entity.js';
import DatabaseService from '../common/database-client/database.service.js';
import CityService from '../modules/city/city.service.js';
import { CityModel } from '../modules/city/city.entity.js';
import { CityServiceInterface } from '../modules/city/city-service.interface.js';
import { OfferModel } from '../modules/offer/offer.entity.js';
import OfferService from '../modules/offer/offer.service.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = 'test';


export default class ImportCommand implements CliCommandInterface {

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.logger = new ConsoleLoggerService();
    this.offerService = new OfferService(this.logger, OfferModel);
    this.userService = new UserService(this.logger, UserModel);
    this.cityService = new CityService(this.logger, CityModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  public readonly name = '--import';
  private userService!: UserServiceInterface;
  private cityService!: CityServiceInterface;
  private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  private async saveOffer(offer: Offer) {

    const user = await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);

    const city = await this.cityService.findOrCreate(offer.city);

    await this.offerService.create({
      ...offer,
      userId: user.id,
      cityId: city.id,
    });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count: number) {
    console.log(chalk.black.bgGreen.bold(`${count} rows imported.`));
    this.databaseService.disconnect();
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('line', this.onLine);
    fileReader.on('end', this.onComplete);

    try {
      await fileReader.read();
    } catch(err) {
      console.log(chalk.black.bgRed.bold(`Can't read the file: ${getErrorMessage(err)}`));
    }
  }

}

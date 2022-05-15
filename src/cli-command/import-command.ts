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

const DEFAULT_DB_PORT = 27017;
const DEFAULT_USER_PASSWORD = 'test';


export default class ImportCommand implements CliCommandInterface {

  constructor() {
    this.onLine = this.onLine.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.logger = new ConsoleLoggerService();
    // this.offerService = new OfferService(this.logger, OfferModel);
    // this.categoryService = new CategoryService(this.logger, CategoryModel);
    this.userService = new UserService(this.logger, UserModel);
    this.databaseService = new DatabaseService(this.logger);
  }

  public readonly name = '--import';
  private userService!: UserServiceInterface;
  // private offerService!: OfferServiceInterface;
  private databaseService!: DatabaseInterface;
  private logger: LoggerInterface;
  private salt!: string;

  private async saveOffer(offer: Offer) {
    // const categories = [];
    // const user = await this.userService.findOrCreate({
    //   ...offer.user,
    //   password: DEFAULT_USER_PASSWORD
    // }, this.salt);
    await this.userService.findOrCreate({
      ...offer.user,
      password: DEFAULT_USER_PASSWORD
    }, this.salt);


    // for (const {name} of offer.categories) {
    //   const existCategory = await this.categoryService.findByCategoryNameOrCreate(name, {name});
    //   categories.push(existCategory.id);
    // }

    // await this.offerService.create({
    //   ...offer,
    //   categories,
    //   userId: user.id,
    // });
  }

  private async onLine(line: string, resolve: () => void) {
    const offer = createOffer(line);
    console.log(offer); //TODO убрать вконце
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

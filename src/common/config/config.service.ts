import 'reflect-metadata';
import {ConfigInterface} from './config.interface.js';
import {config} from 'dotenv';
import {inject, injectable} from 'inversify';
import {LoggerInterface} from '../logger/logger.interface.js';
import {configSchema, ConfigSchema} from './config.schema.js';
import {Component} from '../../types/component.types.js';

@injectable()
export default class ConfigService implements ConfigInterface {
  private config: ConfigSchema;
  private logger: LoggerInterface;

  constructor(@inject(Component.LoggerInterface) logger: LoggerInterface) {
    this.logger = logger;

    const parsedOutput = config();

    if (parsedOutput.error) {
      this.logger.error('Can\'t read .env file. Perhaps the file does not exists.');
      throw new Error('Can\'t read .env file. Perhaps the file does not exists.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.info});

    this.config = configSchema.getProperties();
    this.logger.info('.env file found and successfully parsed!');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}

import { Logger as AzureLogger } from '@dvsa/azure-logger';

export class Logger extends AzureLogger {
  constructor() {
    super('FTTS', 'ftts-location-api');
  }
}

export const logger = new Logger();

import { Logger } from '@dvsa/azure-logger';
import { config } from '../config/index';

const logger = new Logger('FTTS', config?.websiteSiteName);

enum BusinessTelemetryEvent {
  LOC_REFRESH_CACHE = 'LOC_REFRESH_CACHE',
  LOC_EXT_API_ERROR = 'LOC_EXT_API_ERROR',
  LOC_EGRESS_ERROR = 'LOC_EGRESS_ERROR',
}

export {
  BusinessTelemetryEvent,
  logger,
};

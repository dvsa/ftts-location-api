import { AzureFunction, Context } from '@azure/functions';
import { nonHttpTriggerContextWrapper } from '@dvsa/azure-logger';
import { withEgressFiltering } from '@dvsa/egress-filtering';
import { getAllowedAddresses, onInternalAccessDeniedError } from '../services';
import { BusinessTelemetryEvent, logger } from '../utils/logger';
import { CentresCache } from '../refresh-cache/refresh-cache';

export const timerTrigger: AzureFunction = async (): Promise<void> => {
  logger.event(BusinessTelemetryEvent.LOC_REFRESH_CACHE, 'Centres cache refresh start');
  const cache = new CentresCache();
  try {
    await cache.refresh();
  } catch (error) {
    logger.error(error as Error, 'RefreshCacheTimer::timerTrigger: Unknown Error');
    throw error;
  }
};

export const index = async (context: Context): Promise<void> => {
  await nonHttpTriggerContextWrapper(withEgressFiltering(timerTrigger, getAllowedAddresses(), onInternalAccessDeniedError, logger), context);
};

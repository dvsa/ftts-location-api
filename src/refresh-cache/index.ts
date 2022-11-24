import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { httpTriggerContextWrapper } from '@dvsa/azure-logger';
import { withEgressFiltering } from '@dvsa/egress-filtering';
import { ErrorResponse } from '../interfaces';
import { getAllowedAddresses, onInternalAccessDeniedError } from '../services';
import { logger } from '../utils/logger';
import { CentresCache } from './refresh-cache';

export const httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
  logger.debug('RefreshCache::httpTrigger: Incoming Query', {
    queryParams: JSON.stringify(context.req?.query),
    requestBody: JSON.stringify(context.req?.body),
  });

  const cache = new CentresCache();
  context.res = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    await cache.refresh();
    context.res = {
      ...context.res,
      body: {
        code: 200,
        message: 'Centres cache updated',
      },
    };
  } catch (e) {
    const errorResponse = (<ErrorResponse>e).status ? e as ErrorResponse : undefined;
    if (!errorResponse) {
      logger.error(e as Error, 'RefreshCache::httpTrigger: Unknown Error refreshing cache');
      throw e;
    }
    logger.error(e as Error, `RefreshCache::httpTrigger: Error trying to refresh cache - ${errorResponse.message}`, {
      ...errorResponse,
    });
    context.res = {
      ...context.res,
      status: 500,
      body: {
        code: 500,
        message: 'Centres cache refresh failed',
      },
    };
  }

  logger.debug('RefreshCache::httpTrigger: Outgoing Response', {
    responseStatus: JSON.stringify(context.res.status),
    responseBody: JSON.stringify(context.res.body),
  });
  context.done();
};

export const index = async (context: Context, req: HttpRequest): Promise<void> => {
  await httpTriggerContextWrapper(withEgressFiltering(httpTrigger, getAllowedAddresses(), onInternalAccessDeniedError, logger), context, req);
};

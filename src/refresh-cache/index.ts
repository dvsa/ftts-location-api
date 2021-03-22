import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { httpTriggerContextWrapper } from '@dvsa/azure-logger';
import { logger } from '../utils/logger';
import { CentresCache } from './refresh-cache';

export const httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
  logger.event('Launch', 'location-api refresh-cache');
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
    context.log(`Centres cache refresh failed - ${JSON.stringify(e)}`);
    context.res = {
      ...context.res,
      status: 500,
      body: {
        code: 500,
        message: 'Centres cache refresh failed',
      },
    };
  }
  context.done();
};

export const index = async (context: Context, req: HttpRequest): Promise<void> => {
  await httpTriggerContextWrapper(httpTrigger, context, req);
};

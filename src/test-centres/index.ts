import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { httpTriggerContextWrapper } from '@dvsa/azure-logger';
import { ErrorResponse } from '../interfaces';
import { logger } from '../utils/logger';
import TestCentres from './test-centres';

const httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
  logger.event('Launch', 'location-api test-centres');
  const centres = new TestCentres();
  context.res = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  try {
    const testCentres = await centres.getTestCentres(context);
    context.res = {
      ...context.res,
      body: {
        status: 200,
        testCentres,
      },
    };
  } catch (error) {
    const errorResponse = 'status' in error ? error as ErrorResponse : undefined;
    if (!errorResponse) throw error;
    context.res = {
      ...context.res,
      status: errorResponse.status,
      body: errorResponse,
    };
  }
};

export default async (context: Context, req: HttpRequest): Promise<void> => {
  await httpTriggerContextWrapper(httpTrigger, context, req);
};

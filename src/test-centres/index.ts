import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { httpTriggerContextWrapper } from '@dvsa/azure-logger';
import { withEgressFiltering } from '@dvsa/egress-filtering';
import { ErrorResponse } from '../interfaces';
import { logger } from '../utils/logger';
import { getAllowedAddresses, onInternalAccessDeniedError } from '../services';
import TestCentres from './test-centres';

const httpTrigger: AzureFunction = async (context: Context): Promise<void> => {
  logger.debug('TestCentres::httpTrigger: Incoming Query', {
    queryParams: JSON.stringify(context.req?.query),
    requestBody: JSON.stringify(context.req?.body),
  });

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
    const errorResponse = (<ErrorResponse>error).status ? error as ErrorResponse : undefined;
    if (!errorResponse) {
      logger.error(error as Error, 'TestCentres::httpTrigger: Unknown Error trying to get test centres');
      throw error;
    }
    logger.error(error as Error, `TestCentres::httpTrigger: Error trying to get test centres - ${errorResponse.message}`, {
      ...errorResponse,
    });
    context.res = {
      ...context.res,
      status: errorResponse?.status,
      body: errorResponse,
    };
  }
  logger.debug('TestCentres::httpTrigger: Outgoing Response', {
    responseStatus: JSON.stringify(context.res.status),
    responseBody: JSON.stringify(context.res.body),
  });
  context.done();
};

export default async (context: Context, req: HttpRequest): Promise<void> => {
  await httpTriggerContextWrapper(withEgressFiltering(httpTrigger, getAllowedAddresses(), onInternalAccessDeniedError, logger), context, req);
};

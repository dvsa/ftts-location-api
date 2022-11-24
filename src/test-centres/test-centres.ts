import { Context } from '@azure/functions';
import { logger } from '../utils/logger';
import {
  GetTestCentreQuery,
  LocationRequest,
  TestCentre,
  ValidationError,
} from '../interfaces';
import { buildErrorResponse, validateRequest } from '../utils';
import { retrieveTestCentres } from '../services';

class TestCentres {
  public async getTestCentres(context: Context): Promise<TestCentre[]> {
    const err = buildErrorResponse(400, 'Bad Request - validation failed');
    if (context.req) {
      const { region, term, numberOfResults } = context.req.query as unknown as GetTestCentreQuery;
      const request: LocationRequest = {
        region,
        term,
        numberOfResults,
      };
      try {
        validateRequest(request);
      } catch (error) {
        logger.error(
          error as Error,
          'TestCentres::getTestCentres: Returning 400 error - validateRequest failed',
          {
            request: JSON.stringify(request),
            validationErrors: JSON.stringify((error as ValidationError).validationErrors),
          },
        );
        return Promise.reject(err);
      }

      const results = await retrieveTestCentres(request);
      return Promise.resolve(results);
    }
    logger.error(new Error('TestCentres::getTestCentres: Returning 400 error - missing context.req'));
    return Promise.reject(err);
  }
}

export default TestCentres;

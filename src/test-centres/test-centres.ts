import { Context } from '@azure/functions';
import { logger } from '../utils/logger';
import { LocationRequest, TestCentre } from '../interfaces';
import { buildErrorResponse, validateRequest } from '../utils';
import { retrieveTestCentres } from '../services';

class TestCentres {
  public async getTestCentres(context: Context): Promise<TestCentre[]> {
    const err = buildErrorResponse(400, 'Bad Request - validation failed');
    if (context.req) {
      const { region, term, numberOfResults } = context.req.query;
      const request: LocationRequest = {
        region,
        term,
        numberOfResults,
      };
      if (!validateRequest(request)) {
        logger.error(
          new Error('TEST-CENTRES::getTestCentres: Returning 400 error - validateRequest failed'),
          undefined,
          { request: JSON.stringify(request) },
        );
        return Promise.reject(err);
      }
      const results = await retrieveTestCentres(request);
      return Promise.resolve(results);
    }
    logger.error(new Error('TEST-CENTRES::getTestCentres: Returning 400 error - missing context.req'));
    return Promise.reject(err);
  }
}

export default TestCentres;

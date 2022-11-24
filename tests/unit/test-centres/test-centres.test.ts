import { Context } from '@azure/functions';

import { logger } from '../../../src/utils/logger';
import TestCentres from '../../../src/test-centres/test-centres';
import { Region } from '../../../src/enums';

jest.mock('../../../src/services/test-centres', () => ({
  retrieveTestCentres: () => ([
    { name: 'Centre 1', addressCity: 'Birmingham' },
    { name: 'Centre 2', addressCity: 'Nottingham' },
  ]),
}));

describe('Locations API', () => {
  let centres: TestCentres;
  let mockContext: Context;

  beforeEach(() => {
    centres = new TestCentres();
    mockContext = ({
      req: {
        method: 'GET',
        params: {},
        query: {
          numberOfResults: '10',
        },
      },
    } as unknown) as Context;
  });

  afterEach(() => jest.clearAllMocks());

  describe('returns a list of centres', () => {
    test('function handles missing req', async () => {
      delete mockContext.req;

      await expect(centres.getTestCentres(mockContext)).rejects.toStrictEqual({
        status: 400,
        message: 'Bad Request - validation failed',
      });
      expect(logger.error).toHaveBeenCalled();
    });

    test('function handles empty request parameters', async () => {
      await expect(centres.getTestCentres(mockContext)).rejects.toStrictEqual({
        status: 400,
        message: 'Bad Request - validation failed',
      });
      expect(logger.error).toHaveBeenCalled();
    });

    test('good request', async () => {
      mockContext.req.query = {
        ...mockContext.req.query,
        region: Region.NI,
        term: 'Birmingham',
      };

      const actual = await centres.getTestCentres(mockContext);

      expect(actual).toHaveLength(2);
    });
  });
});

import { logger } from '../../../src/utils/logger';
import { buildErrorResponse, validateRequest, handleGeocodingError } from '../../../src/utils';
import { Region } from '../../../src/enums';
import {
  errorUnknown,
  errorInvalidRequest,
  errorRequestDenied,
  errorOverQueryLimit,
  errorOverDailyLimit,
} from '../../stubs/geocoding-birmingham';

describe('buildErrorResponse', () => {
  test('error response built correctly', () => {
    const sc = 400;
    const ms = 'Example error';

    const actual = buildErrorResponse(sc, ms);

    expect(actual).toStrictEqual({
      status: 400,
      message: 'Example error',
    });
  });
});

describe('validateRequest', () => {
  test('good input (1)', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: '10',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(true);
  });

  test('good input (2)', () => {
    const query = {
      region: Region.NI.toUpperCase(),
      term: 'Belfast',
      numberOfResults: '50',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(true);
  });

  test('bad region (1)', () => {
    const query = {
      region: 'roi',
      term: 'Dublin',
      numberOfResults: '50',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  test('bad term (1)', () => {
    const query = {
      region: Region.GB,
      term: 'B',
      numberOfResults: '50',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  test('bad term (2)', () => {
    const query = {
      region: Region.GB,
      term: 'This is really long and in no way reflective of what a real user would input but needed to test the most absolute extreme input that could possibly be send over for a location search as a geographical point of interest. This is really long and in no way reflective of what a real user would input but needed to test the most absolute extreme input that could possibly be send over for a location search as a geographical point of interest. So that sentence twice is still not enough to hit the limit so I need to add this.',
      numberOfResults: '50',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  test('bad numberOfResults (1)', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: '3',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  test('bad numberOfResults (2)', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: '51',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  test('bad numberOfResults (3)', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: 'five',
    };

    const actual = validateRequest(query);

    expect(actual).toBe(false);
  });

  describe('handles all critical geocoding errors', () => {
    const errors = [errorOverDailyLimit, errorOverQueryLimit, errorRequestDenied, errorInvalidRequest, errorUnknown];

    test.each(errors)('returns an error response and logs with critical', (error) => {
      const errorResponse = {
        response: {
          data: error,
          status: 500,
          statusText: '',
          headers: [],
          config: {},
        },
      };
      const message = 'LocationAPI is not able to process request';

      const actual = handleGeocodingError(errorResponse.response);

      expect(logger.critical).toBeCalledWith(message, { response: JSON.stringify(errorResponse.response.data) });
      expect(actual).toStrictEqual(buildErrorResponse(500, message));
    });
  });

  test('handle non critical geocoding errors', () => {
    const error = {
      response: {
        data: {
          error_message: 'Request timed out',
          status: 'ERROR',
          results: [],
          status_code: 408,
        },
        status: 408,
        statusText: '',
        headers: [],
        config: {},
      },
    };
    const message = 'LocationAPI is not able to process request';

    const actual = handleGeocodingError(error.response);

    expect(logger.error).toBeCalledWith(new Error(message), message, { response: JSON.stringify(error.response.data) });
    expect(actual).toStrictEqual(buildErrorResponse(500, `${message}`));
  });

  test('handle unknown errors', () => {
    const error = {
      data: {
        status: 'UNKNOWN',
      },
      status: 500,
      statusText: '',
      headers: [],
      config: {},
    };
    const message = 'LocationAPI is not able to process request';

    const actual = handleGeocodingError(error);

    expect(actual).toStrictEqual(buildErrorResponse(500, `${message}`));
  });
});

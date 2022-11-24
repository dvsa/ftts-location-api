import { logger } from '../../../src/utils/logger';
import { buildErrorResponse, validateRequest, handleGeocodingError } from '../../../src/utils';
import { Region, ValidationErrors } from '../../../src/enums';
import {
  errorUnknown,
  errorInvalidRequest,
  errorRequestDenied,
  errorOverQueryLimit,
  errorOverDailyLimit,
} from '../../stubs/geocoding-birmingham';
import { LocationRequest, ValidationError } from '../../../src/interfaces';

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
    expect(() => validateRequest(query)).not.toThrow();
  });

  test('good input (2)', () => {
    const query = {
      region: Region.NI.toUpperCase(),
      term: 'Belfast',
      numberOfResults: '50',
    };

    expect(() => validateRequest(query)).not.toThrow();
  });

  test('missing region from query string', () => {
    const query = {
      term: 'Dublin',
      numberOfResults: '50',
    };
    expect(() => validateRequest(query as LocationRequest)).toThrow(new ValidationError([ValidationErrors.MISSING_REGION]));
  });

  test('invalid region', () => {
    const query = {
      region: 'roi',
      term: 'Dublin',
      numberOfResults: '50',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_REGION]));
  });

  test('missing term from query string', () => {
    const query = {
      region: Region.GB,
      numberOfResults: '50',
    };
    expect(() => validateRequest(query as LocationRequest)).toThrow(new ValidationError([ValidationErrors.MISSING_TERM]));
  });

  test('invalid term - string is too short', () => {
    const query = {
      region: Region.GB,
      term: 'B',
      numberOfResults: '50',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_TERM]));
  });

  test('invalid term - term is too long', () => {
    const query = {
      region: Region.GB,
      term: 'This is really long and in no way reflective of what a real user would input but needed to test the most absolute extreme input that could possibly be send over for a location search as a geographical point of interest. This is really long and in no way reflective of what a real user would input but needed to test the most absolute extreme input that could possibly be send over for a location search as a geographical point of interest. So that sentence twice is still not enough to hit the limit so I need to add this.',
      numberOfResults: '50',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_TERM]));
  });

  test('missing numberOfResults', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
    };
    expect(() => validateRequest(query as LocationRequest)).toThrow(new ValidationError([ValidationErrors.MISSING_NUMBER_OF_RESULTS]));
  });

  test('invalid numberOfResults - number is too low', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: '3',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_NUMBER_OF_RESULTS]));
  });

  test('invalid numberOfResults - number is too high', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: '51',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_NUMBER_OF_RESULTS]));
  });

  test('invalid numberOfResults - not a number', () => {
    const query = {
      region: Region.GB,
      term: 'Birmingham',
      numberOfResults: 'five',
    };
    expect(() => validateRequest(query)).toThrow(new ValidationError([ValidationErrors.INVALID_NUMBER_OF_RESULTS]));
  });
});

describe('handleGeocodingError', () => {
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

      expect(logger.critical).toHaveBeenCalledWith(`handleGeocodingError:: ${error.status}`, { response: JSON.stringify(errorResponse.response.data) });
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

    expect(logger.error).toHaveBeenCalledWith(new Error(message), `handleGeocodingError:: ${message}`, { response: JSON.stringify(error.response.data) });
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

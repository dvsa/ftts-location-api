import { mocked } from 'ts-jest/utils';

import { InternalAccessDeniedError } from '@dvsa/egress-filtering';
import { getAllowedAddresses, onInternalAccessDeniedError } from '../../../src/services/index';
import { BusinessTelemetryEvent, logger } from '../../../src/utils/logger';
import { config } from '../../../src/config';

const mockedConfig = mocked(config, true);

describe('egress test suite', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    mockedConfig.websiteSiteName = 'LOCATION_API';
    mockedConfig.crm.auth.resource = 'https://test-crm-dynamics-url.com';
    mockedConfig.geocoding.geocodingUrl = 'https://maps.googleapis.com';
  });

  describe('getAllowedAddresses', () => {
    test('successfully returns whitelisted urls', () => {
      expect(getAllowedAddresses()).toEqual([
        {
          host: 'test-crm-dynamics-url.com',
          port: 443,
        },
        {
          host: 'maps.googleapis.com',
          port: 443,
        },
      ]);
    });

    test('rejects a non-whitelisted url', () => {
      config.crm.auth.resource = 'nonWhitelistedUrl';

      expect(getAllowedAddresses()).toEqual([
        {
          host: '',
          port: undefined,
        },
        {
          host: 'maps.googleapis.com',
          port: 443,
        },
      ]);
    });
  });

  describe('onInternalAccessDeniedError', () => {
    test('proper event gets logged if url is not-whitelisted', () => {
      const error: InternalAccessDeniedError = new InternalAccessDeniedError('localhost', '80', 'Unrecognised address');
      // eslint-disable-next-line no-useless-escape
      expect(() => onInternalAccessDeniedError(error)).toThrow(error);
      expect(logger.security).toHaveBeenCalledWith(expect.any(String), {
        host: error.host,
        port: error.port,
        reason: JSON.stringify(error),
      });
      expect(logger.event).toHaveBeenCalledWith(BusinessTelemetryEvent.LOC_EGRESS_ERROR, error.message, {
        host: error.host,
        port: error.port,
        reason: JSON.stringify(error),
      });
    });
  });
});

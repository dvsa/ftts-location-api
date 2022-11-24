import DynamicsWebApi from 'dynamics-web-api';
import * as client from '../../../src/services/dynamics-web-api';
import { mocked } from 'ts-jest/utils';

import { ChainedTokenCredential } from '@dvsa/ftts-auth-client';
import { config } from '../../../src/config';
import { mockedLogger } from '../../stubs/logger.mock';
import { onTokenRefresh } from '../../../src/services/dynamics-web-api';

const mockedConfig = mocked(config, true);
const mockedChainedTokenCredential = mocked(ChainedTokenCredential, true);

jest.mock('dynamics-web-api');
jest.mock('@dvsa/ftts-auth-client');

describe('Dynamics Web Api', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConfig.websiteSiteName = 'LOCATION_API';
    mockedConfig.crm.auth.tenantId = 'TENANT_ID';
    mockedConfig.crm.auth.clientId = 'CRM_CLIENT_ID';
    mockedConfig.crm.auth.clientSecret = 'CRM_CLIENT_SECRET';
    mockedConfig.crm.auth.scope = 'CRM_SCOPE_URL';
    mockedConfig.crm.auth.userAssignedEntityClientId = 'USER_ASSIGNED_ENTITY_CLIENT_ID';
  });
  describe('onTokenCallback', () => {
    test('GIVEN valid credentials WHEN called THEN returns a new token', async () => {
      const expectedAccessToken = {
        token: 'thisIsAFakeTokenForTestingPurposes',
        expiresOnTimestamp: 213,
      };

      mockedChainedTokenCredential.prototype.getToken.mockResolvedValue(expectedAccessToken);

      let actualToken = 'TEST';
      const callback: (token: string) => void = (token) => {
        actualToken = token;
      };
      await onTokenRefresh(callback);

      expect(mockedChainedTokenCredential.prototype.getToken).toHaveBeenCalledWith('CRM_SCOPE_URL');
      expect(actualToken).toBe(expectedAccessToken.token);
      expect(mockedLogger.error).toHaveBeenCalledTimes(0);
    });

    test('GIVEN getToken fails WHEN called THEN returns empty string', async () => {
      const crmError = new Error('fail');
      mockedChainedTokenCredential.prototype.getToken.mockRejectedValue(crmError);

      let actualToken = 'TEST';
      const callback: (token: string) => void = (token) => {
        actualToken = token;
      };
      await onTokenRefresh(callback);

      expect(mockedChainedTokenCredential.prototype.getToken).toHaveBeenCalledWith('CRM_SCOPE_URL');
      expect(actualToken).toBe('');
      expect(mockedLogger.error).toHaveBeenCalledWith(
        crmError,
        'dynamicsWebApi::onTokenRefresh: Failed to authenticate with CRM - fail',
      );
    });

    test('GIVEN client WHEN initialised THEN returns object of type DynamicsWebApi', () => {
      const response = client.dynamicsWebApiClient();
      expect(response instanceof DynamicsWebApi).toBe(true);
    });
  });
});

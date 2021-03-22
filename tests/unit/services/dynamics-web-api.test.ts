import DynamicsWebApi from 'dynamics-web-api';
import authClient from '@dvsa/ftts-auth-client';
import * as client from '../../../src/services/dynamics-web-api';

jest.mock('dynamics-web-api');
jest.mock('@dvsa/ftts-auth-client');

describe('Dynamics Web Api', () => {
  describe('onTokenCallback', () => {
    test('successfully retrives the token', async () => {
      authClient.getToken = jest.fn().mockResolvedValue({ value: '12345' });
      let actualToken: string;

      const tokenCallback : (token: string) => void = (token) => {
        actualToken = token;
      };
      await client.onTokenRefresh(tokenCallback);

      expect(actualToken).toEqual('12345');
    });
    test('returns an empty string if it fails to retrive the token', async () => {
      authClient.getToken = jest.fn().mockRejectedValue('Error');
      let actualToken: string;

      const tokenCallback : (token: string) => void = (token) => {
        actualToken = token;
      };
      await client.onTokenRefresh(tokenCallback);

      expect(actualToken).toEqual('');
    });
  });

  test('dynamicsWebApiClient', () => {
    const response = client.dynamicsWebApiClient();
    expect(response instanceof DynamicsWebApi).toEqual(true);
  });
});

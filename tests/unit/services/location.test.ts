import { AxiosResponse } from 'axios';
import { mocked } from 'ts-jest/utils';

import { retrieveLocation } from '../../../src/services/location';
import { birmingham200 } from '../../stubs/geocoding-birmingham';
import * as httpLimiter from '../../../src/utils/http-limiter';

import { config } from '../../../src/config';

const mockedConfig = mocked(config, true);

jest.mock('axios');
jest.mock('../../../src/utils/http-limiter', () => ({
  get: jest.fn(),
}));


const mockedHttpLimiter = httpLimiter as jest.Mocked<typeof httpLimiter>;

describe('Geocoding', () => {
  beforeEach(() => {
    mockedConfig.websiteSiteName = 'LOCATION_API';
    mockedConfig.geocoding.geocodingUrl = 'https://maps.googleapis.com/';
    mockedConfig.geocoding.apiKey = 'apiKey';
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('Makes request to geocoding api', () => {
    test('Handles search that returns zero results', async () => {
      const resolvedBody: AxiosResponse = {
        status: 200,
        data: {
          status: 'ZERO_RESULTS',
          results: [],
        },
      } as AxiosResponse;
      mockedHttpLimiter.get.mockImplementationOnce(() => Promise.resolve(resolvedBody));

      await expect(retrieveLocation('Not Known Location')).rejects.toEqual({
        status: 400,
        message: 'Bad Request - Geocoding api was not able to translate search term into location',
      });
    });

    test('Handles search that returns results', async () => {
      const expectedBody: AxiosResponse = birmingham200 as AxiosResponse;
      mockedHttpLimiter.get.mockImplementationOnce(() => Promise.resolve(expectedBody));

      const actual = await retrieveLocation('Birmingham%20-%20City%20Centre');

      expect(mockedHttpLimiter.get).toHaveBeenCalledWith('https://maps.googleapis.com/address=Birmingham%2520-%2520City%2520Centre,%20UK&key=apiKey&region=uk');
      expect(actual).toStrictEqual({
        latitude: 52.48624299999999,
        longitude: -1.890401,
      });
    });

    test('Handles other geocoding api warnings', async () => {
      const resolvedBody: AxiosResponse = {
        status: 200,
        data: {
          status: 'SOME_ERROR',
          results: [],
        },
      } as AxiosResponse;
      mockedHttpLimiter.get.mockImplementationOnce(() => Promise.resolve(resolvedBody));

      await expect(retrieveLocation('Some Error')).rejects.toEqual({
        status: 500,
        message: 'LocationAPI is not able to process request',
      });
    });

    test('Handles other geocoding api errors', async () => {
      const rejectedBody: any = {
        status: 500,
        data: {
          status: 'SOME_ERROR',
          results: [],
        },
      };
      mockedHttpLimiter.get.mockImplementationOnce(() => Promise.reject(rejectedBody));

      await expect(retrieveLocation('Some Error')).rejects.toEqual({
        status: 500,
        message: 'LocationAPI is not able to process request',
      });
    });
  });
});

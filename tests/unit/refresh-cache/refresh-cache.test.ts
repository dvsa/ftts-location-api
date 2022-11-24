import fs from 'fs';

import { CentresCache } from '../../../src/refresh-cache/refresh-cache';
import { TestCentre } from '../../../src/interfaces';
import { CRMClient } from '../../../src/services/crm';

jest.mock('../../../src/services/crm', () => ({
  CRMClient: {
    getInstance: () => ({
      getAllTestCentres: jest.fn(async (): Promise<TestCentre[]> => {
        const res = [];
        for (let i = 0, j = 24; i < j; i++) {
          res.push({
            name: '',
            parentOrganisation: '',
            status: '',
            region: null,
            state: null,
            siteId: '',
            description: '',
            accessible: '',
            fullyAccessible: true,
            addressLine1: '',
            addressLine2: '',
            addressCity: '',
            addressCounty: '',
            addressPostalCode: '',
            addressCountryRegion: '',
            latitude: 1,
            longitude: 1,
            ftts_tcntestcentreid: '',
          });
        }
        return Promise.resolve(res);
      }),
    }),
  },
}));

const stubCentre = {
  name: '',
  parentOrganisation: '',
  status: '',
  region: null,
  state: null,
  siteId: '',
  description: '',
  accessible: '',
  fullyAccessible: true,
  addressLine1: '',
  addressLine2: '',
  addressCity: '',
  addressCounty: '',
  addressPostalCode: '',
  addressCountryRegion: '',
  latitude: 1,
  longitude: 1,
};

describe('Cache mechanism', () => {
  let MockCache: CentresCache;

  beforeEach(() => {
    MockCache = new CentresCache(fs.promises);
  });

  afterAll(() => jest.resetAllMocks());

  describe('Empty cache storage', () => {
    test('Can request from CRM', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce('');
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();
      const actual = await MockCache.read();

      expect(actual).toHaveLength(24);
    });

    test('Handles file write to storage failure', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValue('');
      jest.spyOn(fs.promises, 'writeFile').mockRejectedValueOnce(new Error());

      const actual = await MockCache.read();

      expect(actual).toHaveLength(24);
    });

    test('Handles CRM call failure', async () => {
      jest.spyOn(fs.promises, 'readFile').mockRejectedValueOnce(new Error());
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();
      CRMClient.getInstance = jest.fn().mockImplementationOnce(() => ({
        getAllTestCentres: jest.fn().mockRejectedValue(Error('test')),
      }));

      await expect(MockCache.read()).rejects.toThrow('test');
    });
  });

  describe('Populated cache storage', () => {
    test('Can read from cache storage', async () => {
      jest.spyOn(fs.promises, 'readFile').mockResolvedValueOnce(JSON.stringify([stubCentre, stubCentre]));
      jest.spyOn(fs.promises, 'writeFile').mockResolvedValue();

      const actual = await MockCache.read();

      expect(actual).toHaveLength(2);
    });
  });
});

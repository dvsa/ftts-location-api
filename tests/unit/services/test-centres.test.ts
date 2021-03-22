import { retrieveTestCentres } from '../../../src/services/test-centres';
import { LocationRequest, TestCentre } from '../../../src/interfaces';
import { Region } from '../../../src/enums';
import { CentresCache } from '../../../src/refresh-cache/refresh-cache';

jest.mock('../../../src/services/location', () => ({
  retrieveLocation: jest.fn(),
}));
jest.mock('../../../src/services/distance-calculator', () => ({
  sortTestCentresByDistance: (location: Location, testCentres: TestCentre[]): TestCentre[] => testCentres,
}));

describe('test-centres', () => {
  beforeEach(() => {
    jest.spyOn(CentresCache.prototype, 'read').mockImplementation(() => {
      const res = [];
      for (let i = 0, j = 24; i < j; i++) {
        res.push({
          lat: i,
          lng: i,
          state: i % 4 ? Region.GB : Region.NI,
        });
      }
      return Promise.resolve(res);
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('retrieveTestCentres', () => {
    test('get GB Results', async () => {
      const params: LocationRequest = {
        numberOfResults: '10',
        region: 'GB',
        term: 'Birmingham',
      };
      expect(((await retrieveTestCentres(params)).length)).toEqual(10);
    });
    test('get NI results', async () => {
      const params: LocationRequest = {
        numberOfResults: '10',
        region: 'NI',
        term: 'Belfast',
      };
      expect(((await retrieveTestCentres(params)).length)).toEqual(6);
    });
  });
});

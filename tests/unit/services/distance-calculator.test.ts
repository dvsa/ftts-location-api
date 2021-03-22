import { sortTestCentresByDistance } from '../../../src/services/distance-calculator';
import { Location } from '../../../src/interfaces';

// Mock haversine lib to calculate basic straight line distance
jest.mock('haversine', () => (locationA: Location, locationB: Location) => {
  const distance = Math.sqrt(((locationA.latitude - locationB.latitude) ** 2) + (locationA.longitude - locationB.longitude) ** 2);
  return distance;
});

describe('Distance calculator', () => {
  describe('sortTestCentresByDistance', () => {
    test('returns list of test centres sorted by distance to search location', () => {
      const mockSearchLocation = {
        latitude: 1,
        longitude: 1,
      };
      const mockTestCentres = [
        {
          name: 'Test Centre A',
          latitude: 4,
          longitude: 4,
        },
        {
          name: 'Test Centre B',
          latitude: 2,
          longitude: 2,
        },
        {
          name: 'Test Centre C',
          latitude: 3,
          longitude: 3,
        },
      ];

      const results = sortTestCentresByDistance(mockSearchLocation, mockTestCentres as any);

      expect(results.length).toEqual(3);
      results.forEach((result) => expect(result).toHaveProperty('distance'));
      expect(results[0].name).toEqual('Test Centre B');
      expect(results[1].name).toEqual('Test Centre C');
      expect(results[2].name).toEqual('Test Centre A');
    });
  });
});

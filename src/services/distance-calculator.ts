import haversine from 'haversine';
import { Location, TestCentre } from '../interfaces';

const calculateDistanceInMiles = (locationA: Location, locationB: Location): number => {
  // MVP "as the crow flies" haversine distance
  const distance = haversine(locationA, locationB, { unit: 'mile' });
  return distance;
};

export const sortTestCentresByDistance = (location: Location, testCentres: TestCentre[]): TestCentre[] => {
  const results = [...testCentres];

  results.forEach((testCentre) => {
    const testCentreLocation: Location = {
      latitude: testCentre.latitude,
      longitude: testCentre.longitude,
    };
    testCentre.distance = calculateDistanceInMiles(location, testCentreLocation);
  });

  // We know the distance has been set in the line above so we can safely cast to a number
  results.sort((a, b) => ((a.distance as number) > (b.distance as number) ? 1 : -1));

  return results;
};

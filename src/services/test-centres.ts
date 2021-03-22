import { retrieveLocation } from './location';
import { sortTestCentresByDistance } from './distance-calculator';
import { LocationRequest, TestCentre } from '../interfaces';
import { CentresCache } from '../refresh-cache/refresh-cache';

export const retrieveTestCentres = async (params: LocationRequest): Promise<TestCentre[]> => {
  const cache = new CentresCache();
  const allTestCentres = await cache.read();

  const region = params.region.toLowerCase();
  const filteredTestCentres = allTestCentres.filter((centre) => centre.state === region);

  const searchLocation = await retrieveLocation(params.term);
  const sortedTestCentres = sortTestCentresByDistance(searchLocation, filteredTestCentres);

  const limit = Number(params.numberOfResults);
  const results = sortedTestCentres.slice(0, limit);

  return Promise.resolve(results);
};

import { retrieveLocation } from './location';
import { sortTestCentresByDistance } from './distance-calculator';
import { LocationRequest, TestCentre } from '../interfaces';
import { CentresCache } from '../refresh-cache/refresh-cache';
import { logger } from '../utils/logger';

export const retrieveTestCentres = async (params: LocationRequest): Promise<TestCentre[]> => {
  const cache = new CentresCache();
  const allTestCentres = await cache.read();

  const region = params.region.toLowerCase();
  const filteredTestCentres = allTestCentres.filter((centre) => centre.state === region);
  logger.debug(`test-centres::retrieveTestCentres: There were ${allTestCentres.length} tests centres in the cache and ${filteredTestCentres.length} after filtering`);

  const searchLocation = await retrieveLocation(params.term);
  const sortedTestCentres = sortTestCentresByDistance(searchLocation, filteredTestCentres);

  const limit = Number(params.numberOfResults);
  const results = sortedTestCentres.slice(0, limit);

  return Promise.resolve(results);
};

/* eslint-disable @typescript-eslint/return-await */
/* eslint-disable security/detect-non-literal-fs-filename */
// Rule bypassed as the cache file is an ENV var so we are unable to hard code it
import fs from 'fs';

import { logger } from '../utils/logger';
import { config } from '../config';
import { CRMClient } from '../services/crm';
import { TestCentre } from '../interfaces';

class CentresCache {
  constructor(private files = fs.promises) { }

  async readCache(): Promise<TestCentre[]> {
    let response: TestCentre[];
    try {
      const centres = await this.files.readFile(config.crm.cache, { encoding: 'utf-8' });
      logger.debug('CentresCache::readCache: - successfully read from centres cache ', {
        filePath: config.crm.cache,
        testCentresData: centres,
      });
      response = JSON.parse(centres) as TestCentre[];
    } catch (e) {
      logger.error(e as Error, 'CentresCache::readCache: Error trying to read test centre cache');
      response = [];
    }
    return response;
  }

  async read(): Promise<TestCentre[]> {
    try {
      const data = await this.readCache();
      if (data.length) {
        return data;
      }
      logger.warn('CentresCache:read: Cache is empty - trying to update from CRM');
      const centres = await this.refresh();
      return centres;
    } catch (e) {
      logger.error(e as Error, 'CentresCache::read: Failed to read cache');
      return Promise.reject(e);
    }
  }

  async refresh(): Promise<TestCentre[]> {
    let centres: TestCentre[] = [];
    try {
      centres = await CRMClient.getInstance().getAllTestCentres();
      logger.debug('CentresCache::refresh: Updated list of centres retrieved from CRM', {
        crmCentres: JSON.stringify(centres),
      });
      await this.files.writeFile(config.crm.cache, JSON.stringify(centres), { encoding: 'utf-8' });
      logger.debug('CentresCache::refresh: Centres cache refresh successful');
      return centres;
    } catch (e) {
      if (centres.length) {
        logger.error(e as Error, 'CentresCache::refresh: Failed to write to cache');
        return centres;
      }
      logger.error(e as Error, 'CentresCache::refresh: Failed to get test centres from CRM');
      return Promise.reject(e);
    }
  }
}

export {
  CentresCache,
};

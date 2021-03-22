/* eslint-disable security/detect-non-literal-fs-filename */
// Rule bypassed as the cache file is an ENV var so we are unable to hard code it
import fs from 'fs';

import { logger } from '../utils/logger';
import config from '../config';
import { CRMClient } from '../services/crm';
import { TestCentre } from '../interfaces';

class CentresCache {
  constructor(private files = fs.promises) { }

  async readCache(): Promise<TestCentre[]> {
    let response: TestCentre[];
    try {
      const centres = await this.files.readFile(config.crm.cache, { encoding: 'utf-8' });
      logger.log('REFRESH-CACHE::readCache - read from centres success');
      response = JSON.parse(centres) as TestCentre[];
    } catch (e) {
      logger.error(e, 'REFRESH-CACHE::readCache - read from centres fail');
      response = [];
    }
    return Promise.resolve(response);
  }

  async read(): Promise<TestCentre[]> {
    try {
      const data = await this.readCache();
      if (data.length) {
        return Promise.resolve(data);
      }
      logger.warn('REFRESH-CACHE::read - Cache is empty - trying to update from CRM');
      const centres = await this.refresh();
      return Promise.resolve(centres);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async refresh(): Promise<TestCentre[]> {
    logger.event('REFRESH-CACHE::refresh - Centres cache refresh start');
    let centres: TestCentre[] = [];
    try {
      centres = await CRMClient.getInstance().getAllTestCentres();
      logger.log('REFRESH-CACHE::refresh - Updated list of centres retrieved from CRM');
      await this.files.writeFile(config.crm.cache, JSON.stringify(centres), { encoding: 'utf-8' });
      logger.log('REFRESH-CACHE::refresh - Write to storage successful');
      logger.log('REFRESH-CACHE::refresh - Centres cache refresh successful');
      return Promise.resolve(centres);
    } catch (e) {
      if (centres.length) {
        logger.error(e, 'REFRESH-CACHE::refresh - cache fs write failed');
        return Promise.resolve(centres);
      }
      logger.error(e, 'REFRESH-CACHE::refresh - call to CRM failed');
      return Promise.reject(e);
    }
  }
}

export {
  CentresCache,
};

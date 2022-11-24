import { mocked } from 'ts-jest/utils';
import { httpTrigger } from '../../../src/refresh-cache/index';
import { CentresCache } from '../../../src/refresh-cache/refresh-cache';
import { mockedContext } from '../../stubs/context.mock';

jest.mock('../../../src/refresh-cache/refresh-cache');
const centresCacheController = mocked(CentresCache, true);

describe('refreshCacheTrigger', () => {
  test('Runs controller', async () => {
    await httpTrigger(mockedContext, {});
    expect(centresCacheController.prototype.refresh).toHaveBeenCalled();
  });
});

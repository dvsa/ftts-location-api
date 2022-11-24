import { mocked } from 'ts-jest/utils';
import { timerTrigger } from '../../../src/refresh-cache-timer/index';
import { CentresCache } from '../../../src/refresh-cache/refresh-cache';
import { logger } from '../../../src/utils/logger';
import { mockedContext } from '../../stubs/context.mock';

jest.mock('../../../src/refresh-cache/refresh-cache');
const centresCacheController = mocked(CentresCache, true);

describe('refreshCacheTimerTrigger', () => {
  test('Runs controller', async () => {
    await timerTrigger(mockedContext, {});
    expect(centresCacheController.prototype.refresh).toHaveBeenCalled();
  });

  test('Throws error', async () => {
    const expectedError = new Error('test1');
    centresCacheController.prototype.refresh.mockRejectedValue(expectedError);

    await expect(() => timerTrigger(mockedContext, {}))
      .rejects.toThrow(expectedError);

    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error).toHaveBeenCalledWith(expectedError, 'RefreshCacheTimer::timerTrigger: Unknown Error');
  });
});

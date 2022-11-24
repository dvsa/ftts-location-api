import { logger } from '../../src/utils/logger';
import { mocked } from 'ts-jest/utils';
export const mockedLogger = mocked(logger, true);

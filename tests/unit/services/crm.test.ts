import { logger } from '../../../src/utils/logger';
import { CRMClient } from '../../../src/services/crm';
import { listPayload } from '../../stubs/crm';
import { mockedDynamicsWebApi } from '../../stubs/dynamics-web-api.mock';

jest.mock('@dvsa/ftts-auth-client');
describe('CRMClient', () => {
  let crmClient: CRMClient;

  beforeEach(() => {
    crmClient = new CRMClient(mockedDynamicsWebApi);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getInstance', () => {
    test('returns an instance of the CRM Client', () => {
      const client = CRMClient.getInstance();
      expect(client instanceof CRMClient).toEqual(true);
    });
  });

  describe('getAllTestCentres', () => {
    test('Fetching list of test centres', async () => {
      mockedDynamicsWebApi.retrieveMultipleRequest.mockResolvedValue(listPayload);

      const result = await crmClient.getAllTestCentres();

      expect(result.length).toEqual(1);
      expect(result[0]).toStrictEqual({
        accessible: 'Accessible',
        accountId: '9220caf6-1c5d-ea11-a811-000d3a7f128d',
        addressCity: 'MARTOCK',
        addressCountryRegion: 'United Kingdom',
        addressCounty: null,
        addressLine1: '105  Ross Road',
        addressLine2: null,
        addressPostalCode: 'TA12 4BT',
        description: 'Test',
        fullyAccessible: true,
        latitude: 23.22345,
        longitude: 23.22322,
        name: 'TCL-001-Region A',
        parentOrganisation: null,
        region: null,
        remit: 675030000,
        siteId: '12311',
        state: 'gb',
        status: 'ACTIVE',
      });
    });

    test('throws an error if no test centres are returned', async () => {
      mockedDynamicsWebApi.retrieveMultipleRequest.mockResolvedValue({ value: [] });

      await expect(crmClient.getAllTestCentres()).rejects.toEqual(new Error('No Test Centres Found in CRM'));
    });

    test('handles CRM list request failure', async () => {
      mockedDynamicsWebApi.retrieveMultipleRequest.mockImplementation(() => Promise.reject(Error('list failed')));

      await expect(crmClient.getAllTestCentres()).rejects.toThrow('list failed');
      expect(logger.error).toHaveBeenCalled();
    });
  });
});

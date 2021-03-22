import { logger } from '../utils/logger';
import testCentreAdapter from '../utils/test-centre-adapter';
import { CRMAccount, TestCentre } from '../interfaces';
import { OrganisationType, TestCentreStatus } from '../enums';
import { dynamicsWebApiClient } from './dynamics-web-api';

export class CRMClient {
  private static instance: CRMClient;

  constructor(private dynamicsWebApi: DynamicsWebApi) { }

  public static getInstance(): CRMClient {
    if (!CRMClient.instance) {
      CRMClient.instance = new CRMClient(dynamicsWebApiClient());
    }
    return CRMClient.instance;
  }

  public async getAllTestCentres(): Promise<TestCentre[]> {
    try {
      const response = await this.dynamicsWebApi.retrieveMultipleRequest<CRMAccount>({
        collection: 'accounts',
        filter: `ftts_organisationtype eq ${OrganisationType.TEST_CENTRE_LOCATION} and ftts_tclstatus eq ${TestCentreStatus.ACTIVE}`,
        select: [
          'name',
          '_parentaccountid_value',
          'ftts_siteid',
          'description',
          'ftts_accessible',
          'ftts_fullyaccessible',
          'address1_line1',
          'address1_line2',
          'address1_city',
          'address1_county',
          'address1_postalcode',
          'address1_country',
          'address1_latitude',
          'address1_longitude',
          'accountid',
          'ftts_tclstatus',
          'ftts_regiona',
          'ftts_regionb',
          'ftts_regionc',
          'ftts_remit',
        ],
      });

      if (!response.value || response.value.length === 0) {
        logger.critical('CRM::getAllTestCentres: No test centres returned from CRM');
        throw new Error('No Test Centres Found in CRM');
      }
      return response.value.map((account: CRMAccount) => testCentreAdapter.adapt(account));
    } catch (e) {
      const message: string = e instanceof Error ? e.message : 'unknown';
      logger.error(e, `CRM::getAllTestCentres: ${message}`);
      return Promise.reject(e);
    }
  }
}

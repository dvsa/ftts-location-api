import testCentreAdapter from '../../../src/utils/test-centre-adapter';
import { Region, TestCentreRegion } from '../../../src/enums';
import { CRMAccount, TestCentre } from '../../../src/interfaces';

describe('Test centre adapter', () => {
  test('maps a CRMAccount to a TestCentre', () => {
    const mockCrmAccount: CRMAccount = {
      name: 'Account Name',
      _parentaccountid_value: '5678',
      ftts_tclstatus: 675030000,
      ftts_regiona: false,
      ftts_regionb: true,
      ftts_regionc: false,
      ftts_remit: 675030000,
      ftts_siteid: '1234',
      description: 'Description',
      ftts_accessible: 'Text',
      ftts_fullyaccessible: true,
      address1_line1: '10 Test Street',
      address1_line2: null,
      address1_city: 'Birmingham',
      address1_county: 'West Midlands',
      address1_postalcode: 'B1 3ST',
      address1_country: 'UK',
      address1_latitude: '38.8951',
      address1_longitude: '-77.0364',
      accountid: '84c1f4f0-202c-4aed-8306-8f6f84940ff4',
    };

    const result = testCentreAdapter.adapt(mockCrmAccount);

    const expectedResult: TestCentre = {
      name: 'Account Name',
      parentOrganisation: '5678',
      status: 'ACTIVE',
      region: TestCentreRegion.B,
      state: Region.GB,
      siteId: '1234',
      description: 'Description',
      accessible: 'Text',
      fullyAccessible: true,
      addressLine1: '10 Test Street',
      addressLine2: null,
      addressCity: 'Birmingham',
      addressCounty: 'West Midlands',
      addressPostalCode: 'B1 3ST',
      addressCountryRegion: 'UK',
      longitude: -77.0364,
      latitude: 38.8951,
      accountId: '84c1f4f0-202c-4aed-8306-8f6f84940ff4',
      remit: 675030000,
    };
    expect(result).toStrictEqual(expectedResult);
  });
});

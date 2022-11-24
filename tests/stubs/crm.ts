import { CRMAccount } from '../../src/interfaces';

const buildListPayload = (): { value: CRMAccount[] } => ({
  value: [
    {
      name: 'TCL-001-Region A',
      _parentaccountid_value: null,
      ftts_siteid: '12311',
      description: 'Test',
      ftts_accessible: 'Accessible',
      ftts_fullyaccessible: true,
      address1_line1: '105  Ross Road',
      address1_line2: null,
      address1_city: 'MARTOCK',
      address1_county: null,
      address1_postalcode: 'TA12 4BT',
      address1_country: 'United Kingdom',
      address1_latitude: '23.22345',
      address1_longitude: '23.22322',
      accountid: '9220caf6-1c5d-ea11-a811-000d3a7f128d',
      ftts_tclstatus: 675030000,
      ftts_regiona: false,
      ftts_regionb: false,
      ftts_regionc: false,
      ftts_remit: 675030000,
      ftts_tcntestcentreid: '12311',
      parentaccountid: {
        ftts_regiona: false,
        ftts_regionb: false,
        ftts_regionc: false,
      },
    },
  ],
});

export {
  buildListPayload,
};

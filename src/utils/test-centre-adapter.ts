/* eslint-disable no-underscore-dangle */
// Rule bypassed as we are unable to do anything about the naming of CRM properties
import { Adapter, TestCentre, CRMAccount } from '../interfaces';
import {
  TestCentreStatus, TestCentreRegion, Remit, Region,
} from '../enums';

class TestCentreAdapter implements Adapter<TestCentre> {
  adapt(account: CRMAccount): TestCentre {
    return {
      name: account.name,
      parentOrganisation: account._parentaccountid_value,
      status: this.mapStatus(account),
      region: this.mapRegion(account),
      state: this.mapState(account),
      siteId: account.ftts_siteid,
      description: account.description,
      accessible: account.ftts_accessible,
      fullyAccessible: account.ftts_fullyaccessible,
      addressLine1: account.address1_line1,
      addressLine2: account.address1_line2,
      addressCity: account.address1_city,
      addressCounty: account.address1_county,
      addressPostalCode: account.address1_postalcode,
      addressCountryRegion: account.address1_country,
      latitude: Number(account.address1_latitude),
      longitude: Number(account.address1_longitude),
      accountId: account.accountid,
      remit: account.ftts_remit,
    };
  }

  private mapStatus(account: CRMAccount): string | null {
    return TestCentreStatus[account.ftts_tclstatus as number] || null;
  }

  private mapRegion(account: CRMAccount): TestCentreRegion | null {
    if (account.ftts_regiona) return TestCentreRegion.A;
    if (account.ftts_regionb) return TestCentreRegion.B;
    if (account.ftts_regionc) return TestCentreRegion.C;
    return null;
  }

  private mapState(account: CRMAccount): Region | null {
    const remitMap = {
      [Remit.DVA]: Region.NI,
      [Remit.DVSA]: Region.GB,
    };
    return remitMap[account.ftts_remit as Remit] || null;
  }
}

export default new TestCentreAdapter();

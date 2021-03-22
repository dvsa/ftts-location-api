export interface CRMAccount {
  name: string;
  _parentaccountid_value: string | null;
  ftts_tclstatus: number | null;
  ftts_regiona: boolean | null;
  ftts_regionb: boolean | null;
  ftts_regionc: boolean | null;
  ftts_remit: number | null;
  ftts_siteid: string;
  description: string | null;
  ftts_accessible: string | null;
  ftts_fullyaccessible: boolean | null;
  address1_line1: string;
  address1_line2: string | null;
  address1_city: string;
  address1_county: string | null;
  address1_postalcode: string;
  address1_country: string;
  address1_latitude: string | null;
  address1_longitude: string | null;
  accountid: string;
}

import { AxiosResponse } from 'axios';
import { Region, TestCentreRegion } from '../enums';

export interface TestCentre {
  name: string;
  parentOrganisation: string | null;
  status: string | null;
  region: TestCentreRegion | null;
  state: Region | null;
  siteId: string;
  description: string | null;
  accessible: string | null;
  fullyAccessible: boolean | null;
  addressLine1: string;
  addressLine2: string | null;
  addressCity: string;
  addressCounty: string | null;
  addressPostalCode: string;
  addressCountryRegion: string;
  latitude: number;
  longitude: number;
  distance?: number;
  accountId: string;
  remit: number | null;
  ftts_tcntestcentreid: string;
}

export interface GetTestCentreQuery {
  region: string;
  term: string;
  numberOfResults: string;
}

export interface LocationRequest {
  region: string;
  term: string;
  numberOfResults: string;
}

export interface ErrorResponse {
  status: number;
  message: string;
}

export interface GeocodingAxiosResponseData {
  status: string;
}

export interface GeocodingErrorResponse<T = unknown> extends AxiosResponse {
  data: T;
  error?: string;
}

export interface Adapter<T> {
  // Rule bypassed as this is a generic adapter so we don't want to limit what adapt can process.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  adapt(item: any): T;
}

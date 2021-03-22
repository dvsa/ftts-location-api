export interface GeocodingResponse {
  error_message?: string;
  status: string;
  results: GeocoderResult[];
  status_code?: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

export interface GeocoderResult {
  address_components: {
    long_name: string;
    short_name: string;
    types: string[];
  }[];
  formatted_address: string;
  geometry: {
    bounds: {
      east: number;
      north: number;
      south: number;
      west: number;
    };
    location: {
      lat: number;
      lng: number;
    };
    location_type: 'APPROXIMATE' | 'GEOMETRIC_CENTER' | 'RANGE_INTERPOLATED' | 'ROOFTOP';
    viewport: {
      east: number;
      north: number;
      south: number;
      west: number;
    };
  };
  partial_match: boolean;
  place_id: string;
  postcode_localities: string[];
  types: string[];
}

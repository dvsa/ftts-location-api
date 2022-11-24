export interface GeocodingResponse {
  error_message?: string;
  status: string;
  results: GeocoderResult[];
  status_code?: number;
}

export interface GeocodingAddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export interface GeocodingLatLong {
  lat: number;
  lng: number;
}

export interface Location {
  latitude: number;
  longitude: number;
}

// API Spec https://developers.google.com/maps/documentation/geocoding/overview#GeocodingResponses
export interface GeocoderResult {
  address_components: GeocodingAddressComponent[];
  formatted_address: string;
  geometry: {
    bounds?: {
      northeast: GeocodingLatLong;
      southwest: GeocodingLatLong;
    };
    location: GeocodingLatLong;
    location_type: 'APPROXIMATE' | 'GEOMETRIC_CENTER' | 'RANGE_INTERPOLATED' | 'ROOFTOP';
    viewport: {
      northeast: GeocodingLatLong;
      southwest: GeocodingLatLong;
    };
  };
  partial_match?: boolean;
  place_id: string;
  plus_code?: {
    compound_code?: string;
    global_code: string;
  };
  postcode_localities?: string[];
  types: string[];
}

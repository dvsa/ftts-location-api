import config from '../config';
import { GeocodingResponse, Location } from '../interfaces';
import { handleGeocodingError } from '../utils';
import { get } from '../utils/http-limiter';
import { logger } from '../utils/logger';

const retrieveLocation = async (term: string): Promise<Location> => {
  const encodedTerm = encodeURIComponent(term);
  const path = `${config.geocoding.geocodingUrl}address=${encodedTerm}&key=${config.geocoding.apiKey}&region=uk`;
  logger.log(`GEOCODING:: Sending geocoding request to ${path}`);

  try {
    const response = await get<GeocodingResponse>(path);
    if (response.data.status === 'OK') {
      const location: Location = {
        latitude: response.data.results[0].geometry.location.lat,
        longitude: response.data.results[0].geometry.location.lng,
      };
      logger.log('GEOCODING:: Request returned 200 and OK status', { latitude: location.latitude.toString(), longitude: location.longitude.toString() });
      return Promise.resolve(location);
    }
    return Promise.reject(handleGeocodingError(response));
  } catch (error) {
    return Promise.reject(handleGeocodingError(error));
  }
};

export {
  retrieveLocation,
};

import { AxiosError, AxiosResponse } from 'axios';

import { logger } from './logger';
import { Region } from '../enums';
import { ErrorResponse, GeocodingErrorResponse, LocationRequest } from '../interfaces';

const buildErrorResponse = (statusCode: number, message: string): ErrorResponse => ({
  status: statusCode,
  message,
});

const handleGeocodingError = (httpResponse: AxiosResponse | AxiosError): ErrorResponse => {
  const message = 'LocationAPI is not able to process request';

  let response: GeocodingErrorResponse | undefined;
  if (httpResponse && (httpResponse as AxiosError).isAxiosError) {
    response = (httpResponse as AxiosError).response;
  } else {
    response = httpResponse as AxiosResponse;
  }

  if (response) {
    if (response.data) {
      const { data } = response;

      if (data.status === 'ZERO_RESULTS') {
        logger.critical('Zero results received from Geocoding api');
        return buildErrorResponse(400, 'Bad Request - Geocoding api was not able to translate search term into location');
      }

      if (['OVER_DAILY_LIMIT', 'OVER_QUERY_LIMIT', 'REQUEST_DENIED', 'INVALID_REQUEST', 'UNKNOWN_ERROR'].includes(data.status)) {
        logger.critical(message, { response: JSON.stringify(response.data) });
        return buildErrorResponse(500, message);
      }

      logger.error(new Error(message), message, { response: JSON.stringify(response.data) });
      return buildErrorResponse(500, message);
    }

    logger.critical(message, { response: JSON.stringify(response.error) });
    return buildErrorResponse(500, message);
  }
  logger.critical(message, { httpResponse: JSON.stringify(httpResponse) });
  return buildErrorResponse(500, message);
};

const validateRequest = (query: LocationRequest): boolean => {
  if (!query.region
    || !query.term
    || !query.numberOfResults
    || !(query.region.toLowerCase() === Region.GB || query.region.toLowerCase() === Region.NI)
    || query.term.length < 3
    || query.term.length > 512
    || Number.isNaN(Number(query.numberOfResults))
    || Number(query.numberOfResults) < 5
    || Number(query.numberOfResults) > 50) {
    return false;
  }
  return true;
};

export {
  buildErrorResponse,
  validateRequest,
  handleGeocodingError,
};

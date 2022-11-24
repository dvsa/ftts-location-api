import { AxiosError, AxiosResponse } from 'axios';
import { Region, ValidationErrors } from '../enums';
import {
  ErrorResponse,
  GeocodingAxiosResponseData, GeocodingErrorResponse, LocationRequest,
  ValidationError,
} from '../interfaces';
import { BusinessTelemetryEvent, logger } from './logger';

const buildErrorResponse = (statusCode: number, message: string): ErrorResponse => ({
  status: statusCode,
  message,
});

const handleGeocodingError = (httpResponse: AxiosResponse | AxiosError): ErrorResponse => {
  const message = 'LocationAPI is not able to process request';

  let response: GeocodingErrorResponse<GeocodingAxiosResponseData> | undefined;
  if (httpResponse && (httpResponse as AxiosError).isAxiosError) {
    response = (httpResponse as AxiosError).response as AxiosResponse<GeocodingAxiosResponseData>;
  } else {
    response = httpResponse as AxiosResponse as AxiosResponse<GeocodingAxiosResponseData>;
  }

  if (response) {
    if (response.data) {
      const { data } = response;

      if (data.status === 'ZERO_RESULTS') {
        logger.warn('handleGeocodingError:: Zero results received from Geocoding api');
        return buildErrorResponse(400, 'Bad Request - Geocoding api was not able to translate search term into location');
      }

      if (['OVER_DAILY_LIMIT', 'OVER_QUERY_LIMIT', 'REQUEST_DENIED', 'INVALID_REQUEST', 'UNKNOWN_ERROR'].includes(data.status)) {
        logger.event(BusinessTelemetryEvent.LOC_EXT_API_ERROR, `Geocoding API returned the status ${data.status}`);
        logger.critical(`handleGeocodingError:: ${data.status}`, { response: JSON.stringify(response.data) });
        return buildErrorResponse(500, message);
      }

      logger.event(BusinessTelemetryEvent.LOC_EXT_API_ERROR, message);
      logger.error(new Error(message), `handleGeocodingError:: ${message}`, { response: JSON.stringify(response.data) });
      return buildErrorResponse(500, message);
    }

    logger.event(BusinessTelemetryEvent.LOC_EXT_API_ERROR, message);
    logger.critical(`handleGeocodingError:: ${message}`, { response: JSON.stringify(response.error) });
    return buildErrorResponse(500, message);
  }
  logger.event(BusinessTelemetryEvent.LOC_EXT_API_ERROR, message);
  logger.critical(`handleGeocodingError:: ${message}`, { httpResponse: JSON.stringify(httpResponse) });
  return buildErrorResponse(500, message);
};

const validateRequest = (query: LocationRequest): void => {
  const validationErrors: ValidationErrors[] = [];

  if (!query.region) {
    validationErrors.push(ValidationErrors.MISSING_REGION);
  }

  if (query.region && !(query.region.toLowerCase() === Region.GB || query.region.toLowerCase() === Region.NI)) {
    validationErrors.push(ValidationErrors.INVALID_REGION);
  }

  if (!query.term) {
    validationErrors.push(ValidationErrors.MISSING_TERM);
  }

  if (query.term && (query.term.length < 3 || query.term.length > 512)) {
    validationErrors.push(ValidationErrors.INVALID_TERM);
  }

  if (!query.numberOfResults) {
    validationErrors.push(ValidationErrors.MISSING_NUMBER_OF_RESULTS);
  }

  if (Number.isNaN(Number(query.numberOfResults)) || Number(query.numberOfResults) < 5 || Number(query.numberOfResults) > 50) {
    validationErrors.push(ValidationErrors.INVALID_NUMBER_OF_RESULTS);
  }

  if (validationErrors.length > 0) {
    throw new ValidationError(validationErrors);
  }
};

export {
  buildErrorResponse,
  validateRequest,
  handleGeocodingError,
};

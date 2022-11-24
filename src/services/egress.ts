import { addressParser, Address, InternalAccessDeniedError } from '@dvsa/egress-filtering';
import { config } from '../config';
import { BusinessTelemetryEvent, logger } from '../utils/logger';

const getAllowedAddresses = (): Array<Address> => [
  addressParser.parseUri(config.crm.auth.resource),
  addressParser.parseUri(config.geocoding.geocodingUrl),
];

const onInternalAccessDeniedError = (error: InternalAccessDeniedError): void => {
  logger.security('egress::OnInternalAccessDeniedError: url is not whitelisted so it cannot be called', {
    host: error.host,
    port: error.port,
    reason: JSON.stringify(error),
  });

  logger.event(BusinessTelemetryEvent.LOC_EGRESS_ERROR, error.message, {
    host: error.host,
    port: error.port,
    reason: JSON.stringify(error),
  });

  throw error;
};

export {
  getAllowedAddresses,
  onInternalAccessDeniedError,
};

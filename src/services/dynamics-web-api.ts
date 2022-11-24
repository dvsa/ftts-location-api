import DynamicsWebApi from 'dynamics-web-api';
import { ChainedTokenCredential, ClientSecretCredential, ManagedIdentityCredential, TokenCredential } from '@dvsa/ftts-auth-client';
import { config } from '../config';
import { logger } from '../utils/logger';

const sources: TokenCredential[] = [new ManagedIdentityCredential(config.crm.auth.userAssignedEntityClientId)];
if (config.crm.auth.tenantId && config.crm.auth.clientId && config.crm.auth.clientSecret) {
  sources.push(new ClientSecretCredential(config.crm.auth.tenantId, config.crm.auth.clientId, config.crm.auth.clientSecret));
}

export const chainedTokenCredential = new ChainedTokenCredential(...sources);

export const onTokenRefresh = async (dynamicsWebApiCallback: (token: string) => void): Promise<void> => {
  try {
    const accessToken = await chainedTokenCredential.getToken(config.crm.auth.scope);
    dynamicsWebApiCallback(accessToken?.token);
  } catch (error) {
    logger.error(error as Error, `dynamicsWebApi::onTokenRefresh: Failed to authenticate with CRM - ${(error as Error)?.message}`);
    // Callback needs to be called - to prevent function from hanging
    dynamicsWebApiCallback('');
  }
};

export function dynamicsWebApiClient(): DynamicsWebApi {
  return new DynamicsWebApi({
    webApiUrl: `${config.crm.centresUrl}/`,
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    onTokenRefresh,
  });
}

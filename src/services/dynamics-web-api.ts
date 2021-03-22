import DynamicsWebApi from 'dynamics-web-api';
import authClient from '@dvsa/ftts-auth-client';
import config from '../config';

export const onTokenRefresh = async (dynamicsWebApiCallback: (token: string) => void): Promise<void> => {
  try {
    const accessToken = await authClient.getToken(config.crm.auth);
    dynamicsWebApiCallback(accessToken.value);
  } catch (error) {
    // Callback needs to be called - to prevent function from hanging
    dynamicsWebApiCallback('');
  }
};

export function dynamicsWebApiClient(): DynamicsWebApi {
  return new DynamicsWebApi({
    webApiUrl: `${config.crm.centresUrl}/`,
    onTokenRefresh,
  });
}

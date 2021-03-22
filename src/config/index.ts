import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

if (process.env.NODE_ENV === 'development') {
  const result = dotenv.config();
  if (result.error) {
    // This error should crash whole process
    throw new Error("⚠️  Couldn't find .env file  ⚠️");
  }
}

const useStub = process.env.USE_GEOCODING_STUB === 'true';

export default {
  /**
  * Dynamics
  */
  crm: {
    cache: process.env.CRM_CACHE_FILE || 'centres-fallback.json',
    centresUrl: process.env.CRM_CENTRES_URL || '',
    auth: {
      url: process.env.CRM_TOKEN_URL || '',
      clientId: process.env.CRM_CLIENT_ID || '',
      clientSecret: process.env.CRM_CLIENT_SECRET || '',
      resource: process.env.CRM_BASE_URL || '',
    },
  },

  geocoding: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    useStub,
    geocodingUrl: useStub ? process.env.GEOCODING_STUB_URL || '' : process.env.GEOCODING_URL || '',
  },
};

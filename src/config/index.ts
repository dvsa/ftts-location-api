const useStub = process.env.USE_GEOCODING_STUB === 'true';

const config = {
  websiteSiteName: process.env.WEBSITE_SITE_NAME || '',
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
      tenantId: process.env.CRM_TENANT_ID || '',
      userAssignedEntityClientId: process.env.USER_ASSIGNED_ENTITY_CLIENT_ID || '',
      scope: process.env.CRM_SCOPE || '',
    },
  },

  geocoding: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY || '',
    useStub,
    geocodingUrl: useStub ? process.env.GEOCODING_STUB_URL || '' : process.env.GEOCODING_URL || '',
  },
};

export {
  config,
};

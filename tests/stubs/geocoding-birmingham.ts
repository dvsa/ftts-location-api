const birmingham200 = {
  status: 200,
  data: {
    results: [
      {
        address_components: [
          {
            long_name: 'Birmingham',
            short_name: 'Birmingham',
            types: [
              'locality',
              'political',
            ],
          },
          {
            long_name: 'Birmingham',
            short_name: 'Birmingham',
            types: [
              'postal_town',
            ],
          },
          {
            long_name: 'West Midlands',
            short_name: 'West Midlands',
            types: [
              'administrative_area_level_2',
              'political',
            ],
          },
          {
            long_name: 'England',
            short_name: 'England',
            types: [
              'administrative_area_level_1',
              'political',
            ],
          },
          {
            long_name: 'United Kingdom',
            short_name: 'GB',
            types: [
              'country',
              'political',
            ],
          },
        ],
        formatted_address: 'Birmingham, UK',
        geometry: {
          bounds: {
            northeast: {
              lat: 52.5688762,
              lng: -1.7098294,
            },
            southwest: {
              lat: 52.385999,
              lng: -2.0174336,
            },
          },
          location: {
            lat: 52.48624299999999,
            lng: -1.890401,
          },
          location_type: 'APPROXIMATE',
          viewport: {
            northeast: {
              lat: 52.5688762,
              lng: -1.7098294,
            },
            southwest: {
              lat: 52.385999,
              lng: -2.0174336,
            },
          },
        },
        place_id: 'ChIJc3FBGy2UcEgRmHnurvD-gco',
        types: [
          'locality',
          'political',
        ],
      },
    ],
    status: 'OK',
  },
};

const errorOverDailyLimit = {
  error_message: 'Over daily limit',
  status: 'OVER_DAILY_LIMIT',
  results: [],
  status_code: 500,
};

const errorOverQueryLimit = {
  error_message: 'Over query limit',
  status: 'OVER_QUERY_LIMIT',
  results: [],
  status_code: 500,
};

const errorRequestDenied = {
  error_message: 'Request denied',
  status: 'REQUEST_DENIED',
  results: [],
  status_code: 500,
};

const errorInvalidRequest = {
  error_message: 'Invalid request',
  status: 'INVALID_REQUEST',
  results: [],
  status_code: 500,
};

const errorUnknown = {
  error_message: 'Unknown error',
  status: 'UNKNOWN_ERROR',
  results: [],
  status_code: 500,
};

export {
  birmingham200,
  errorOverDailyLimit,
  errorOverQueryLimit,
  errorRequestDenied,
  errorInvalidRequest,
  errorUnknown,
};

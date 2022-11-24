enum Region {
  GB = 'gb',
  NI = 'ni',
}

enum TestCentreRegion {
  A = 'a',
  B = 'b',
  C = 'c',
}

enum TestCentreStatus {
  ACTIVE = 675030000,
  INACTIVE_CLOSED = 675030001,
  INACTIVE_RELOCATED = 675030002,
  INACTIVE_TEMP_UNAVAILABLE = 675030003,
}

enum Remit {
  England = 675030000,
  Wales = 675030002,
  Scotland = 675030003,
  NorthernIreland = 675030001,
}

enum OrganisationType {
  TEST_CENTRE_LOCATION = 675030004,
}

enum ValidationErrors {
  MISSING_REGION = 'region is missing from query string',
  INVALID_REGION = 'region is invalid',
  MISSING_TERM = 'term is missing from query string',
  INVALID_TERM = 'term is invalid it must be between 3 - 512 characters',
  MISSING_NUMBER_OF_RESULTS = 'numberOfResults is missing from query string',
  INVALID_NUMBER_OF_RESULTS = 'numberOfResults is not a number between 5 and 50',
}

export {
  OrganisationType,
  Region,
  Remit,
  TestCentreStatus,
  TestCentreRegion,
  ValidationErrors,
};

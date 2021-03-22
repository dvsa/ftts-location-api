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
  DVSA = 675030000,
  DVA = 675030001,
}

enum OrganisationType {
  TEST_CENTRE_LOCATION = 675030004,
}

export {
  OrganisationType,
  Region,
  Remit,
  TestCentreStatus,
  TestCentreRegion,
};
